import React, { memo, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { emailValidator } from "../core/untilities";
import { theme } from "../core/theme";
import { sendEmailWithPassword } from "../core/auth-api";
import MapBackground from "../components/MapBackground";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Toast from "../components/Toast";
import TheWhiteSquare from '../components/TheWhiteSquare';

const ForgotPasswordScreen = ({ navigation }) => {
   const [email, setEmail] = useState({ value: "", error: "" });
   const [loading, setLoading] = useState(false);
   const [toast, setToast] = useState({ value: "", type: "" });

   const _onSendPressed = async () => {
      if (loading) return;

      const emailError = emailValidator(email.value);

      if (emailError) {
         setEmail({ ...email, error: emailError });
         return;
      }

      setLoading(true);

      const response = await sendEmailWithPassword(email.value);

      if (response.error) {
         setToast({ type: "error", value: response.error });
      } else {
         setToast({
            type: "success",
            value: "Email with password has been sent."
         });
      }

      setLoading(false);
   };

   return (
      <>
         <MapBackground />
         <BackButton goBack={() => navigation.navigate("LoginScreen")} />
         <View style={styles.wrapper}>
            <TheWhiteSquare top={20} height={57}>
               <Logo />

               <Header>Restore Password</Header>

               <TextInput
                  label="E-mail address"
                  returnKeyType="done"
                  value={email.value}
                  onChangeText={text => setEmail({ value: text, error: "" })}
                  error={!!email.error}
                  errorText={email.error}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
               />

               <Button
                  loading={loading}
                  mode="contained"
                  onPress={_onSendPressed}
                  style={styles.button}
                  labelStyle={styles.buttonText}
               >
                  Send Reset Instructions
               </Button>

               <TouchableOpacity
                  style={styles.back}
                  onPress={() => navigation.navigate("LoginScreen")}
               >
                  <Text style={styles.label}>← Back to login</Text>
               </TouchableOpacity>
            </TheWhiteSquare>
         </View>

         <Toast
            type={toast.type}
            message={toast.value}
            onDismiss={() => setToast({ value: "", type: "" })}
         />
      </>
   );
};

const styles = StyleSheet.create({
   back: {
      width: "100%",
      marginTop: 12
   },
   button: {
      marginTop: 12,
   },
   buttonText: {
      fontSize: 12
   },
   label: {
      color: theme.colors.secondary,
      width: "100%"
   },
   wrapper: {
      alignItems: 'center'
   }
});

export default memo(ForgotPasswordScreen);
