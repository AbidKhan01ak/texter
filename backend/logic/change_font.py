def change_font(text: str, font_style: str) -> dict:
    """
    Changes the font style for the given text. In the backend, it only returns the text and font style 
    to be rendered on the frontend using CSS.

    Args:
        text (str): The input text to apply the font style to.
        font_style (str): The font style to be applied. The frontend will handle the actual rendering.

    Returns:
        dict: A dictionary containing the styled text and the font style to be applied.
    """
    return {
        "styledText": text,
        "fontStyle": font_style
    }
