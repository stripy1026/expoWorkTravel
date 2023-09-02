import { StatusBar } from "expo-status-bar";
import Checkbox from "expo-checkbox";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";

import { theme } from "./color";

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
  }, []);

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
            <View style={styles.toDo} key={key}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Checkbox
                  style={styles.toDoText}
                  value={toDos[key].completed}
                  onValueChange={() => checkWorkDone(key)}
                  color={toDos[key].completed ? theme.grey : undefined}
                />
                <Text
                  style={{
                    ...styles.toDoText,
                    marginTop: -2.5,
                    color: toDos[key].completed ? theme.grey : "white",
                  }}
                >
                  {toDos[key].text}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={18} color={theme.grey} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 8,
  },
});
