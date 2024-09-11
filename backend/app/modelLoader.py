
import numpy as np
from tensorflow.keras.models import load_model
import cv2
import matplotlib.pyplot as plt
import random
import os


# Load the trained U-Net model
def loadModel(yesorno):
    cwd = os.getcwd()
    unet_model = load_model(cwd + "\\models\\unet_model_100.h5")

    # Load the input SAR image
    lim = 31 if yesorno == "yes" else 20
    r = random.randint(0,lim)
    input_image_path = cwd + "\\models\\"  + yesorno + "\\" + str(r) + ".jpg"
    input_image = cv2.imread(input_image_path)

    # Check if the image is loaded correctly
    if input_image is None:
        raise FileNotFoundError(f"Image file {input_image_path} not found or unable to load.")

    # Preprocess the input image if needed (resize, normalization, etc.)
    input_image = cv2.resize(input_image, (256, 256))  # Example resizing, adjust based on model requirements
    input_image = input_image / 255.0  # Normalize the image
    input_image = np.expand_dims(input_image, axis=0)  # Add batch dimension

    # Predict the mask for the input image
    prediction = unet_model.predict(input_image)
    predicted_mask = np.argmax(prediction, axis=3)[0, :, :]  # Get the predicted mask

    # Check if any mask is present (i.e., non-zero values in the mask)
    if np.any(predicted_mask > 0):  # If there's any non-background (non-zero) value
        print("Oil spill detected and authorities are notified.")
    else:
        print("No oil spill detected.")

    # Display the input image and predicted mask
    plt.figure(figsize=(10, 5))

    # Input image
    plt.subplot(1, 2, 1)
    plt.imshow(cv2.cvtColor(cv2.imread(input_image_path), cv2.COLOR_BGR2RGB))  # Display input1 in RGB format
    plt.title("Input SAR Image")

    # Predicted Mask
    plt.subplot(1, 2, 2)
    plt.imshow(predicted_mask, cmap='gray')
    plt.title("Predicted Mask")

    # plt.show()
    plt.savefig(cwd + '\\static\\result.jpg', bbox_inches='tight')
    plt.close()

    return


# loadModel("no")