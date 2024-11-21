import random

def generate_images_from_text(text, num_images=6):
    """
    Generate unique image URLs based on the given text input using Pollinations API.

    Args:
        text (str): The input text for generating images.
        num_images (int): The number of images to generate.

    Returns:
        list: A list of URLs of generated images.
    """
    if not text.strip():
        raise ValueError("Input text is empty.")

    base_url = "https://pollinations.ai/p/"
    
    # Categories of variations
    variation_words = [
        "unique", "playful", "cartoon", "happy", "sad", "sunny",
        "cold", "snow", "dark", "sun", "moon", "light", "stormy",
        "rainy", "windy", "foggy", "autumn", "spring", "night",
        "dawn", "twilight", "eclipse", "rainbow", "joyful", 
        "melancholy", "peaceful", "angry", "romantic", "nostalgic",
        "mystical", "dreamy", "mountain", "ocean", "forest", "desert",
        "cityscape", "galaxy", "castle", "spaceship", "lantern"
    ]
    variation_themes = [
        "abstract", "futuristic", "vintage", "surreal", "minimalistic",
        "cyberpunk", "steampunk", "gothic", "fantasy"
    ]
    variation_settings = [
        "garden", "space", "island", "underwater", "cottage", 
        "temple", "mansion", "skyscraper"
    ]
    variation_miscellaneous = [
        "glowing", "ethereal", "whimsical", "haunted", "majestic", 
        "ancient", "celestial", "robotic"
    ]

    # Shuffle the variations for randomness
    random.shuffle(variation_words)
    random.shuffle(variation_themes)
    random.shuffle(variation_settings)
    random.shuffle(variation_miscellaneous)

    if num_images > len(variation_words):
        raise ValueError("Not enough unique variation words to generate requested images.")

    images = []
    try:
        for i in range(num_images):
            # Combine variations for each image
            random_word = variation_words[i]  # Ensure uniqueness
            random_theme = random.choice(variation_themes)
            random_setting = random.choice(variation_settings)
            random_misc = random.choice(variation_miscellaneous)

            # Create a modified text prompt
            modified_text = f"{text} {random_word} {random_theme} {random_setting} {random_misc}"
            image_url = f"{base_url}{modified_text.replace(' ', '_')}"
            images.append(image_url)

        return images
    except Exception as e:
        print(f"Error generating images: {str(e)}")
        raise ValueError("Failed to generate images.")
