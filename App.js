import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { theme } from "./color";
import { styles } from "./styles";
import { ToDo } from "./components/ToDo";

const STORAGE_KEY = "@toDos";
const STORAGE_WORK = "@work";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = async () => {
    await AsyncStorage.setItem(STORAGE_WORK, JSON.stringify(false));
    setWorking(false);
  };
  const work = async () => {
    await AsyncStorage.setItem(STORAGE_WORK, JSON.stringify(true));
    setWorking(true);
  };

  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s === null) return;
    setToDos(JSON.parse(s));
  };

  const loadWorking = async () => {
    const s = await AsyncStorage.getItem(STORAGE_WORK);
    setWorking(JSON.parse(s));
  };

  const addTodo = async () => {
    if (text == "") return;
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, completed: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      {
        text: "Not sure",
      },
      {
        text: "Absolutely",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  const checkWorkDone = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].completed = !newToDos[key].completed;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  useEffect(() => {
    loadToDos();
    loadWorking();
  }, [toDos]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType="done"
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add a Todo" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <ToDo
              key={key}
              toDokey={key}
              onCheck={() => checkWorkDone(key)}
              onPressDelete={() => deleteToDo(key)}
            />
          ) : null
        )}
      </ScrollView>
    </View>
  );
}
