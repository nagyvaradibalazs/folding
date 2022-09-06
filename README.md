# Fold-project - Interactive web-app

The app is available [here](https://nagyvaradibalazs.github.io/folding/).

### Credit

This project was done by Balazs Nagyvaradi as part of his summer (2022) research internship at Aalto University. He is not, however, I web-developer, thus takes no responsibility for the quality of the code and architecture. The development was influenced by Miia Palmu and Markus Holste and supervised by Kirsi Peltonen. The website is part of the ongoing Fold-project founded by Business Finland. You can read more [here](https://fold-project.com/).

### Intro

The main idea here is to create tessellations of simple origami designs, using a single strip as a building block. The app also displays various characteristics of these and helps to visualize them. By repeating this strip, one gets an accordion-looking shape of the flat paper. This gives the final tessellation. The most notable usage is the Miura variations as this fundamentally simple design has many variations, yet, is easy to comprehend and create.

### Instructions

Below is a detailed step-by-step instruction on how to use the app:

* First, you need to define the dimensions of the strip. Give the **Height** and **Width** in mm, then hit **Create**. A rectangle in the middle will appear representing the strip.

* You can now **Add Lines** to your strip. The line that shows up has two boxes with zeros, use these to specify your lines. The two boxes represent the y-coordinate of the endpoints of a line on the left and right side respectively. Once ready, hit **Update**. You may use the **X** button next to every line to delete it.

* By clicking on a corner, close to the meeting lines, the angle is displayed for two seconds. Note that both the acute and their complement obtuse angles are displayed, so you need to interpret them carefully.

* You can colour the line segments on the strip to identify mountains and valleys on the final tessellation. **Red** conventionally stands for the former, while **blue** is used for the latter. Click on any line segment to change its colour. Alternatively, you may use the preset colouring based on the **Miura** and **Yoshimura** rules. It is fine to use these for slightly different patterns too, but the results might not be exact and manual correction might be required.

* The upper right panel shows the profile of the fully folded state. The red curve in the middle is to characterize the profile in a piecewise manner, and it is also approximated by a smooth curve on the very right. This visualization works best for Miura variations but could give useful insights for other designs too.

* Finally, the whole tessellation can be made by giving the number of **Repeats**. When repeating, you have the option to flip (mirror) every other so that the lines join nicely. However, this is totally optional, and you can play with different configurations. The option of vertical **Offset** gives the possibility to translate every strip on the vertical axis with respect to the preceding one. The combination of this and not mirroring can create interesting twisted designs.

* Once ready, click **Make Tessellation**, after which a preview of the SVG file will be displayed. Note that for bigger dimensions and many repeats, the details of this preview might be lost. By hitting **Download Tessellation** you can save the resulting SVG file to your own computer. You may use this SVG to simulate the folding in a simulator by clicking **Open Simulator**.

### Notes

* While the app should work as desired, a fair number of bugs can occur. Make sure to use it as intended, otherwise, it may break. Always follow the steps from above in order to prevent malfunction.

* All web browsers are supported, however, Mozilla Firefox might produce unexpected results and has limited support for SVG handling.

* If the page does not fit perfectly to your screen due to resolution differences, you may want to zoom in-out in your browser setting.
