import os
import numpy
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import numpy as np
from tensorflow.keras.models import load_model # type: ignore
import cv2
import matplotlib.pyplot as plt
import random
import smtplib, ssl
from sarAccess import getSARImage

def sendMail():

    # Define the sender's and recipient's email addresses  
    sender_email = "sboaviswanath@gmail.com"  # Replace with your email address  
    recipient_email = "atchayan.k@gmail.com"  # Replace with recipient's email address  
    password = "dae yennada viswa ippudi pannitiye da" 

    # Email content  
    subject = "ALERT"  
    body = "OIL SPILL DETECTED"  
    message = f"Subject: {subject}\n\n{body}"  

    # Set up the secure SSL context  
    context = ssl.create_default_context()  

    # Connect to the Gmail SMTP server using SSL  
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:  
        # Log in to the email account  
        server.login(sender_email, password)  
        
        # Send the email  
        server.sendmail(sender_email, recipient_email, message)  

    print("Email sent successfully!")

# Load the trained U-Net model
def loadModel(coords):
    cwd = os.getcwd()
    unet_model = load_model(cwd + "\\models\\unet_model_100.h5")

    # Load the input SAR image
    
    getSARImage(coords)

    print("getting image now")
    input_image_path = cwd + "\\static\\sarImage.jpg"
    input_image = cv2.imread(input_image_path)
    print("image read")


    # Check if the image is loaded correctly
    if input_image is None:
        raise FileNotFoundError(f"Image file {input_image_path} not found or unable to load.")

    # Preprocess the input image if needed (resize, normalization, etc.)
    input_image = cv2.resize(input_image, (256, 256))  # Example resizing, adjust based on model requirements
    input_image = input_image / 255.0  # Normalize the image
    plt.imshow(input_image, cmap='gray')
    plt.show()
    input_image = np.expand_dims(input_image, axis=0)  # Add batch dimension

    # Predict the mask for the input image
    prediction = unet_model.predict(input_image)

    #old and deprecated
    predicted_mask = np.argmax(prediction, axis=3)[0, :, :]  


    # Check if any mask is present (i.e., non-zero values in the mask)
    print(predicted_mask)
    print("any is:")
    print(np.any(predicted_mask))
    print("length: ", len(predicted_mask) * len(predicted_mask[0]))
    print("1 count:" ,numpy.count_nonzero(predicted_mask))
    if numpy.count_nonzero(predicted_mask) > 1000:  # If there's any non-background (non-zero) value
        print("Oil spill detected and authorities are notified.")
        # sendMail()
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
    # plt.imshow(colored_mask)
    plt.title("Predicted Mask")

    # plt.show()
    if not os.path.exists(cwd + "\\static"):
        os.makedirs(cwd + "\\static")
    plt.savefig(cwd + '\\static\\result.jpg', bbox_inches='tight')
    plt.close()

    return


# loadModel("no")

'''
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
'''