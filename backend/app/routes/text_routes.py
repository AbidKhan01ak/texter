import os
import logging
from app import db
from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.password_history import PasswordHistory
from werkzeug.utils import secure_filename
from logic.case_conversion import convert_case
from logic.change_font import change_font
from logic.counter_analyzer import analyze_text
from logic.text_encrypter import encrypt_text
from logic.text_decrypter import decrypt_text
from logic.bionic_text import bionic_reading_format
from logic.password_generator import generate_password_from_text
from logic.summary_generator import generate_summary
from logic.whitespace_remover import remove_extra_whitespace
from logic.text_to_word import convert_text_to_word
from logic.text_to_audio import convert_text_to_audio
from logic.text_to_image import generate_images_from_text
from werkzeug.exceptions import BadRequest

# Initialize Blueprint for Text Routes
text_bp = Blueprint('text', __name__)

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

UPLOAD_FOLDER = 'C\downloads'
ALLOWED_EXTENSIONS = {'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@text_bp.route('/case-convert', methods=['POST', 'OPTIONS'])
# @cross_origin(origin='http://localhost:3000')
def case_convert():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')
        conversion_type = data.get('conversionType', 'UPPERCASE')

        if not text:
            raise BadRequest('Text is required.')

        converted_text = convert_case(text, conversion_type)
        return jsonify({'convertedText': converted_text}), 200
    except ValueError as e:
        logger.error(f"Error in case conversion: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@text_bp.route('/change-font', methods=['POST', 'OPTIONS'])
# @cross_origin(origin='http://localhost:3000')
def apply_font():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')
        font_style = data.get('fontStyle', 'Arial')

        if not text:
            raise BadRequest('Text is required.')

        styled_text = change_font(text, font_style)
        return jsonify(styled_text), 200
    except Exception as e:
        logger.error(f"Error in font change: {str(e)}")
        return jsonify({'error': 'Failed to apply font'}), 500

@text_bp.route('/counter-analyzer', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def text_analyzer():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            raise BadRequest('Text is required.')

        counts = analyze_text(text)
        return jsonify(counts), 200
    except Exception as e:
        logger.error(f"Error in text analysis: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@text_bp.route('/encrypt-text', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def encrypt_text_route():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            raise BadRequest('Text is required.')

        encrypted_file_path = encrypt_text(text)
        return send_file(encrypted_file_path, as_attachment=True)
    except Exception as e:
        logger.error(f"Error encrypting text: {str(e)}")
        return jsonify({'error': 'Failed to encrypt text'}), 500

@text_bp.route('/decrypt-text', methods=['POST', 'OPTIONS'])
# @cross_origin(origin='http://localhost:3000')
def decrypt_text_route():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200  # Response to preflight request

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file and allowed_file(file.filename):
        # Save the uploaded file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        file.save(file_path)

        try:
            # Pass the file path to the decrypt function
            decrypted_text = decrypt_text(file_path)
            return jsonify({'decryptedText': decrypted_text}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type. Only .txt files are allowed.'}), 400

@text_bp.route('/bionic-reading', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def bionic_reading():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            raise BadRequest('Text is required.')

        formatted_text = bionic_reading_format(text)
        return jsonify({'formattedText': formatted_text}), 200
    except Exception as e:
        logger.error(f"Error in bionic reading: {str(e)}")
        return jsonify({'error': 'Failed to process bionic reading'}), 500

@text_bp.route('/password-generator', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
@jwt_required()
def password_generator():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        input_text = data.get('inputText', '')
        length = data.get('length', 12)

        if not input_text:
            raise BadRequest('Input text is required.')

        password = generate_password_from_text(input_text, length)

        # Save to password history
        user_id = get_jwt_identity()
        new_history = PasswordHistory(user_id=user_id, password=password)
        db.session.add(new_history)
        db.session.commit()

        return jsonify({'password': password}), 200
    except ValueError as e:
        logger.error(f"Error generating password: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@text_bp.route('/password-history', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
@jwt_required()
def password_history():
    try:
        user_id = get_jwt_identity()
        history = PasswordHistory.query.filter_by(user_id=user_id).all()
        history_data = [{'generated_at': record.generated_at.strftime('%Y-%m-%d %H:%M:%S'), 'password': record.password} for record in history]

        return jsonify(history_data), 200
    except Exception as e:
        logger.error(f"Error fetching password history: {str(e)}")
        return jsonify({'error': 'Failed to fetch password history'}), 500

@text_bp.route('/generate-summary', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def summarize_text():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')
        max_sentences = data.get('maxSentences', 3)

        if not text:
            raise BadRequest('Text is required.')

        summary = generate_summary(text, max_sentences=max_sentences)
        return jsonify({'summary': summary}), 200
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        return jsonify({'error': f'Failed to generate summary: {str(e)}'}), 500

@text_bp.route('/remove-whitespace', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def remove_whitespace():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            raise BadRequest('Text is required.')

        cleaned_text = remove_extra_whitespace(text)
        return jsonify({'cleanedText': cleaned_text}), 200
    except Exception as e:
        logger.error(f"Error removing whitespace: {str(e)}")
        return jsonify({'error': f"Failed to process text: {str(e)}"}), 500

@text_bp.route('/text-to-word', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def text_to_word():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            raise BadRequest('Text is required.')

        file_path = convert_text_to_word(text)
        return send_file(file_path, as_attachment=True, download_name='text.docx')
    except Exception as e:
        logger.error(f"Error converting text to Word: {str(e)}")
        return jsonify({'error': f'Failed to create Word document: {str(e)}'}), 500

@text_bp.route('/text-to-audio', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def text_to_audio():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')
        voice = data.get('voice', 'male')

        if not text:
            raise BadRequest('Text is required.')

        audio_path = convert_text_to_audio(text, voice=voice)
        return send_file(audio_path, as_attachment=False, download_name="texter-io-audio-convertor.mp3")
    except Exception as e:
        logger.error(f"Error converting text to audio: {str(e)}")
        return jsonify({'error': f"Failed to convert text to audio: {str(e)}"}), 500

@text_bp.route('/text-to-image', methods=['POST', 'OPTIONS'])

def text_to_image():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        text = data.get('text', '')
        num_images = data.get('numImages', 6)

        if not text:
            raise BadRequest('Text is required.')

        images = generate_images_from_text(text, num_images=num_images)
        return jsonify({'images': images}), 200
    except Exception as e:
        logger.error(f"Error generating images: {str(e)}")
        return jsonify({'error': f"Failed to generate images: {str(e)}"}), 500
