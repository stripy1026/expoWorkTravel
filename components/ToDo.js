import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { Fontisto } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { theme } from "../color";
import { styles } from "../styles";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export const ToDo = ({ toDokey, onCheck, onPressDelete }) => {
  const [toggleEdit, setToggleEdit] = useState(false);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s === null) return;
    setToDos(JSON.parse(s));
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const editText = async () => {
    if (text == "") return;
    const newToDos = { ...toDos };
    newToDos[toDokey].text = text;
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
    setToggleEdit(false);
  };

  useEffect(() => {
    loadToDos();
  }, [toDos]);

  return !toDos[toDokey] ? null : (
    <View style={styles.toDo}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Checkbox
          style={styles.toDoText}
          value={toDos[toDokey].completed}
          onValueChange={onCheck}
          color={toDos[toDokey].completed ? theme.grey : undefined}
        />
        {toggleEdit ? (
          <TextInput
            returnKeyType="done"
            onSubmitEditing={editText}
            onChangeText={(e) => setText(e)}
            value={text}
            placeholder="Edit"
            style={{
              ...styles.input,
              paddingVertical: 0,
              paddingHorizontal: 80,
              borderRadius: 5,
              marginVertical: 0,
              fontSize: 12,
            }}
          />
        ) : (
          <Text
            style={{
              ...styles.toDoText,
              marginTop: -2.5,
              color: toDos[toDokey].completed ? theme.grey : "white",
            }}
          >
            {toDos[toDokey].text}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ marginHorizontal: 20 }}
          onPress={() => setToggleEdit((prev) => !prev)}
        >
          <FontAwesome name="pencil" size={18} color={theme.grey} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressDelete}>
          <Fontisto name="trash" size={18} color={theme.grey} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
