# Modal Animation Samples (GSAP JSON)

Here are several creative animation sets you can use with the `Modal_01` component. Each set includes:

- **Initial State**
- **Open Animation**
- **Close Animation**

---

## 1. Smooth Fade and Scale

### Initial
```json
{"autoAlpha": 0, "scale": 0.8}
```

### Open
```json
{"autoAlpha": 1, "scale": 1, "duration": 0.5, "ease": "back.out(1.7)", "delay": 0.2}
```

### Close
```json
{"autoAlpha": 0, "scale": 0.8, "duration": 0.5, "ease": "back.in(1.7)", "delay": 0.1}
```

---

## 2. Slide In/Out from the Sides

### Initial
```json
{"autoAlpha": 0, "x": "-100%"}
```

### Open
```json
{"autoAlpha": 1, "x": "0%", "duration": 0.7, "ease": "power2.out", "delay": 0.3}
```

### Close
```json
{"autoAlpha": 0, "x": "100%", "duration": 0.7, "ease": "power2.in", "delay": 0.2}
```

---

## 3. Bounce and Rotate

### Initial
```json
{"autoAlpha": 0, "y": "-50%", "rotation": -15}
```

### Open
```json
{"autoAlpha": 1, "y": "0%", "rotation": 0, "duration": 0.6, "ease": "elastic.out(1, 0.3)", "delay": 0.4}
```

### Close
```json
{"autoAlpha": 0, "y": "50%", "rotation": 15, "duration": 0.6, "ease": "elastic.in(1, 0.3)", "delay": 0.3}
```

---

## 4. 3D Flip Effect

### Initial
```json
{"autoAlpha": 0, "scale": 0.5, "rotationY": 90}
```

### Open
```json
{"autoAlpha": 1, "scale": 1, "rotationY": 0, "duration": 0.8, "ease": "power3.out", "delay": 0.5}
```

### Close
```json
{"autoAlpha": 0, "scale": 0.5, "rotationY": 90, "duration": 0.8, "ease": "power3.in", "delay": 0.4}
```

---

## 5. Bouncy Appearance

### Initial
```json
{"autoAlpha": 0, "scale": 0}
```

### Open
```json
{"autoAlpha": 1, "scale": 1, "duration": 0.8, "ease": "bounce.out", "delay": 0.2}
```

### Close
```json
{"autoAlpha": 0, "scale": 0, "duration": 0.8, "ease": "bounce.in", "delay": 0.2}
```

# Modal Animation Samples (Advanced & Crazy GSAP Sets)

Here are some bold and creative animation sets for the `Modal_01` component using GSAP. Each set includes:

- **Initial State**
- **Open Animation**
- **Close Animation**

---

## 1. Wild Spin & Skew

### Initial
```json
{"autoAlpha": 0, "scale": 0.5, "rotation": 45, "skewX": 30}
```

### Open
```json
{"autoAlpha": 1, "scale": 1, "rotation": 0, "skewX": 0, "duration": 1, "ease": "elastic.out(1, 0.5)", "delay": 0.3}
```

### Close
```json
{"autoAlpha": 0, "scale": 0.5, "rotation": -45, "skewX": -30, "duration": 1, "ease": "elastic.in(1, 0.5)", "delay": 0.2}
```

---

## 2. Morphing 3D Twist

### Initial
```json
{"autoAlpha": 0, "scale": 0.3, "rotationX": 90, "rotationY": 90, "filter": "blur(10px)"}
```

### Open
```json
{"autoAlpha": 1, "scale": 1, "rotationX": 0, "rotationY": 0, "filter": "blur(0px)", "duration": 1, "ease": "power4.out", "delay": 0.3}
```

### Close
```json
{"autoAlpha": 0, "scale": 0.3, "rotationX": 90, "rotationY": 90, "filter": "blur(10px)", "duration": 1, "ease": "power4.in", "delay": 0.2}
```

---

## 3. Rotating Curtain

### Initial
```json
{"autoAlpha": 0, "rotation": 90, "x": "-100%"}
```

### Open
```json
{"autoAlpha": 1, "rotation": 0, "x": "0%", "duration": 0.8, "ease": "circ.out", "delay": 0.4}
```

### Close
```json
{"autoAlpha": 0, "rotation": -90, "x": "100%", "duration": 0.8, "ease": "circ.in", "delay": 0.3}
```

---

## 4. Wacky Flip & Wiggle

### Initial
```json
{"autoAlpha": 0, "scale": 0.2, "rotation": 180, "skewY": 20}
```

### Open
```json
{"autoAlpha": 1, "scale": 1, "rotation": 0, "skewY": 0, "duration": 1.2, "ease": "back.out(2)", "delay": 0.3}
```

### Close
```json
{"autoAlpha": 0, "scale": 0.2, "rotation": -180, "skewY": -20, "duration": 1.2, "ease": "back.in(2)", "delay": 0.2}
```
