import React, { useRef, useState } from 'react';
import { PanResponder, Animated, Text, View } from 'react-native';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import styles from './styles';

interface CircleProps {
  numSections: number;
}

const Circle: React.FC<CircleProps> = ({ numSections }) => {
  const [stoppedSection, setStoppedSection] = useState<number | null>(0);
  const pan = useRef(new Animated.Value(0)).current;
  const sectionPaths: string[] = [];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      pan.setValue(gestureState.moveY); // Adjust based on touch/mouse position
    },
    onPanResponderRelease: (_, gestureState) => {
      // Calculate the selected section based on gestureState
      const radians = Math.atan2(gestureState.dy, gestureState.dx);
      const deg = (radians * 180) / Math.PI + 180;
      const selected = Math.floor(deg / (360 / numSections));

      setStoppedSection(selected);

      // Add inertia effect
      Animated.decay(pan, {
        velocity: gestureState.vy,
        deceleration: 0.997,
        useNativeDriver: true
      }).start();
    },
  });

  // Calculate the angle between sections
  const angle = (2 * Math.PI) / numSections;

  // Create paths for each section
  for (let i = 0; i < numSections; i++) {
    const startAngle = i * angle;
    const endAngle = (i + 1) * angle;

    // Define the path of a section as a piece of the circle
    const pathData = `
      M 0 0
      L ${Math.cos(startAngle) * 100} ${Math.sin(startAngle) * 100}
      A 100 100 0 0 1 ${Math.cos(endAngle) * 100} ${Math.sin(endAngle) * 100}
      Z
    `;

    sectionPaths.push(pathData);
  }

  return (
    <View style={styles.container}>
    <Animated.View
      style={[
        styles.circle,
        {
          transform: [
            {
              rotate: pan.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Svg width="200" height="200" viewBox="-100 -100 200 200">
        <SvgCircle cx="0" cy="0" r="100" fill="transparent" stroke="black" strokeWidth="1" />
        {sectionPaths.map((path, index) => (
          <Path key={index} d={path} fill={`hsl(${(360 / numSections) * index}, 80%, 70%)`} />
        ))}
      </Svg>
    </Animated.View>
      {stoppedSection !== null && (
        <Text style={styles.stoppedSectionText}>{`Stopped at section: ${stoppedSection}`}</Text>
      )}
    </View>
  );
};

export default Circle;
