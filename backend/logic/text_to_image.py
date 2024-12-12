import random
from typing import List

def generate_images_from_text(text: str, num_images: int = 6) -> List[str]:
    """
    Generate unique image URLs based on the given text input using Pollinations API.

    Args:
        text (str): The input text for generating images.
        num_images (int): The number of images to generate.

    Returns:
        List[str]: A list of URLs of generated images.

    Raises:
        ValueError: If input text is empty or if not enough unique variations are available.
    """
    if not text or not text.strip():
        raise ValueError("Input text must not be empty or only whitespace.")

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
    # Check if enough unique variations are available
    if num_images > len(variation_words):
        raise ValueError(
            f"Not enough unique variation words available to generate {num_images} images."
        )

    # Shuffle variations for randomness
    random.shuffle(variation_words)
    random.shuffle(variation_themes)

    # Generate image URLs
    images = []
    for i in range(num_images):
        try:
            # Select unique and random variations
            random_word = variation_words[i]
            random_theme = random.choice(variation_themes)

            # Construct the modified text prompt
            modified_text = f"{text} {random_word} {random_theme}"
            image_url = f"{base_url}{modified_text.replace(' ', '_')}"
            images.append(image_url)
        except Exception as e:
            raise RuntimeError(f"Error generating image {i+1}: {str(e)}") from e

    return images
