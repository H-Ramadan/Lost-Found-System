import os
import uuid
from PIL import Image

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename: str) -> bool:
    """Return True if the file has an allowed image extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file_obj, upload_folder: str, prefix: str = "img") -> str:
    """
    Save an uploaded image file to upload_folder.
    Resizes to a max of 1024px on the longest side to keep file sizes sane.
    Returns the saved filename (not the full path).
    """
    ext = file_obj.filename.rsplit(".", 1)[1].lower()
    filename = f"{prefix}_{uuid.uuid4().hex[:8]}.{ext}"
    save_path = os.path.join(upload_folder, filename)

    try:
        img = Image.open(file_obj)
        # Convert RGBA/P mode images to RGB so JPEG saving works
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        # Resize while preserving aspect ratio
        img.thumbnail((1024, 1024), Image.LANCZOS)
        img.save(save_path, optimize=True, quality=85)
    except Exception:
        # Fallback: save the raw bytes if Pillow fails for any reason
        file_obj.seek(0)
        with open(save_path, "wb") as f:
            f.write(file_obj.read())

    return filename
