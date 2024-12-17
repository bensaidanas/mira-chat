import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

type TaskFormProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
  initialTask: string;
};

export type TaskData = {
  task: string;
  dateTime: Date;
  amount: string;
  additionalInfo: string;
};

const TaskForm: React.FC<TaskFormProps> = ({ isVisible, onClose, onSubmit, initialTask }) => {
  const { colors } = useTheme();
  const [task, setTask] = useState(initialTask);
  const [dateTime, setDateTime] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ task, dateTime, amount, additionalInfo });
      onClose();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDateTime = new Date(dateTime);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      setDateTime(newDateTime);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(dateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDateTime(newDateTime);
    }
  };

  const showDateTimePicker = (mode: 'date' | 'time') => {
    if (mode === 'date') {
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
    }
  };

  const validateForm = (): boolean => {
    if (!task.trim() || !amount.trim()) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              You need {initialTask.toLowerCase()}. Can you provide us with more info?
            </Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Task</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={task}
                onChangeText={setTask}
                placeholder="Task description"
                placeholderTextColor={colors.text}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Date and Time Needed</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={[styles.dateTimeButton, { borderColor: colors.border }]}
                  onPress={() => showDateTimePicker('date')}
                >
                  <Text style={{ color: colors.text }}>
                    {dateTime.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dateTimeButton, { borderColor: colors.border }]}
                  onPress={() => showDateTimePicker('time')}
                >
                  <Text style={{ color: colors.text }}>
                    {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/^(\d{1,2}):(\d{2})/, (match, p1, p2) => `${p1.padStart(2, '0')}:${p2}`)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {(showDatePicker || showTimePicker) && (
              <DateTimePicker
                value={dateTime}
                mode={showDatePicker ? 'date' : 'time'}
                is24Hour={true}
                display="default"
                onChange={showDatePicker ? handleDateChange : handleTimeChange}
              />
            )}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Budget</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="Amount willing to pay"
                placeholderTextColor={colors.text}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Additional Information (Optional)</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }, styles.textArea]}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                placeholder="Any other details about the task"
                placeholderTextColor={colors.text}
                multiline
              />
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskForm;

