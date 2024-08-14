import { View, Text, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'

import { images } from '../../constants'

const SignUp = () => {

  const [form, setForm] = useState({username:'', email: '', password: ''})
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className='text-2xl text-white font-semibold mt-10 font-psemibold'>Sign Up to Aora</Text>

          <FormField
            title="Username"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton 
            title={'Sign-Up'}
            // handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center p-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular" >Already have an account ?</Text>
            <Link href="/SignIn" className="text-lg text-secondary-200 font-psemibold">Sign-In</Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp