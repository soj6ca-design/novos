package com.example.vaniravanessa.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = BellaWineDark,
    onPrimary = Color.Black,
    primaryContainer = BellaWineVariant,
    onPrimaryContainer = Color.White,
    secondary = BellaSecondary,
    secondaryContainer = BellaSecondaryContainer,
    background = BellaBackgroundDark,
    surface = BellaSurfaceDark,
    surfaceVariant = BellaSurfaceVariantDark,
    onBackground = Color(0xFFF3ECF0),
    onSurface = Color(0xFFF3ECF0)
)

private val LightColorScheme = lightColorScheme(
    primary = BellaWinePrimary,
    onPrimary = Color.White,
    primaryContainer = BellaPrimaryContainer,
    onPrimaryContainer = BellaOnPrimaryContainer,
    secondary = BellaSecondary,
    secondaryContainer = BellaSecondaryContainer,
    background = BellaBackgroundLight,
    surface = BellaSurfaceLight,
    surfaceVariant = BellaSurfaceVariantLight,
    onBackground = Color(0xFF201A1D),
    onSurface = Color(0xFF201A1D)
)

@Composable
fun VaniraEVanessaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
