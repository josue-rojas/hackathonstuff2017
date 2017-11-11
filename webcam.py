
import cv2
cap = cv2.VideoCapture(0)
 
def get_image():
 # read is the easiest way to get a full image out of a VideoCapture object.
 retval, im = cap.read()
 return im

def main():
    x =0
    y = 0
    x1 = 0
    y1 = 0
    FaceDetector= cv2.CascadeClassifier("C:/Users/JamilG-Lenovo/Desktop/opencv-3.1.0/etc/haarcascades/haarcascade_frontalface_alt.xml")
    EyeDetector = cv2.CascadeClassifier("C:/Users/JamilG-Lenovo/Desktop/opencv-3.1.0/etc/haarcascades/haarcascade_eye.xml")
    file = "test_image.png"
    
    while(True):
        ret, img = cap.read()
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = FaceDetector.detectMultiScale(gray, 1.3, 5)
        for (x,y,w,h) in faces:
            x1,y1 = x+w,y+h
            cv2.rectangle(img,(x,y),(x1,y1),(255,0,0),2)
            croppedImage = img[y:y1, x:x1]
            eyes = EyeDetector.detectMultiScale(gray, 1.3, 5)
           int eyes =0
            for (ex,ey,ew,eh) in eyes:
                eyex,eyey =ex,ey
                eyex1,eyex2 =ex+ew,ey+eh
                cv2.rectangle(img,(eyex,eyey),(eyex1,eyex2),(255,0,0),2)
                
            cv2.imshow("cropped.png", croppedImage)
            cv2.imwrite(file,croppedImage)
            
        
        cv2.imshow('frame',img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break;
        
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    cap.release()
    cv2.destroyAllWindows()
    quit()
    
main()

