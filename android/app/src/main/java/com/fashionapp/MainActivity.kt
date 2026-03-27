package com.fashionapp

import android.os.Bundle
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "fashionapp"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null) // 🔥 CLAVE PARA DETOX
  }
}