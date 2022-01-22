import React from "react";
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

const Button = (
  props: {
    title: string, color?: string, textColor?: string,
    onPress?: ((event: GestureResponderEvent) => void)
  }) => {
  const { title, color, textColor, onPress } = props

  return (
    <TouchableOpacity style={{ backgroundColor: color ? color : '#007bff', borderRadius: 4, elevation: 2 }} onPress={onPress}>
      <Text style={{ color: textColor ? textColor : '#fff', padding: 10, minWidth: '30%', textAlign: 'center' }}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button;