# backend/logic/change_font.py

def change_font(text, font_style):
    # In the backend, just return the text and font style for the frontend to render
    # The frontend will apply the font style using CSS
    return {
        "styledText": text,
        "fontStyle": font_style
    }
