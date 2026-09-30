package com.example.vaniravanessa.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.vaniravanessa.model.AppMode
import com.example.vaniravanessa.ui.theme.BellaGold
import com.example.vaniravanessa.ui.theme.BellaWinePrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SalonTopBar(
    salonName: String,
    appMode: AppMode,
    isDarkMode: Boolean,
    onToggleDarkMode: () -> Unit,
    onSwitchToClientMode: () -> Unit,
    onRequestExitClientMode: () -> Unit,
    onOpenBackup: () -> Unit,
    onEditSalonName: () -> Unit
) {
    TopAppBar(
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface,
            titleContentColor = MaterialTheme.colorScheme.onSurface
        ),
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(BellaWinePrimary),
                    contentAlignment = Alignment.Center
                ) {
                    Text("💇‍♀️", fontSize = 18.sp)
                }
                Column(modifier = Modifier.clickable { onEditSalonName() }) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = salonName,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Black
                        )
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = "Editar Nome",
                            modifier = Modifier.size(14.dp),
                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                        )
                    }
                    Text(
                        text = if (appMode == AppMode.ADMIN) "Painel do Salão" else "Portal do Cliente",
                        style = MaterialTheme.typography.labelSmall,
                        color = if (appMode == AppMode.ADMIN) BellaWinePrimary else BellaGold
                    )
                }
            }
        },
        actions = {
            // Mode Switcher Pill
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = if (appMode == AppMode.ADMIN) MaterialTheme.colorScheme.primaryContainer else BellaGold.copy(alpha = 0.15f),
                modifier = Modifier
                    .padding(end = 6.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .clickable {
                        if (appMode == AppMode.ADMIN) {
                            onSwitchToClientMode()
                        } else {
                            onRequestExitClientMode()
                        }
                    }
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(
                        imageVector = if (appMode == AppMode.ADMIN) Icons.Default.PhoneAndroid else Icons.Default.Lock,
                        contentDescription = "Alternar Modo",
                        modifier = Modifier.size(16.dp),
                        tint = if (appMode == AppMode.ADMIN) BellaWinePrimary else BellaGold
                    )
                    Text(
                        text = if (appMode == AppMode.ADMIN) "Ver Portal" else "Sair do Portal",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (appMode == AppMode.ADMIN) BellaWinePrimary else BellaGold
                    )
                }
            }

            // Dark Mode Toggle
            IconButton(onClick = onToggleDarkMode) {
                Icon(
                    imageVector = if (isDarkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                    contentDescription = "Alternar Tema",
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }

            // Backup & Database
            if (appMode == AppMode.ADMIN) {
                IconButton(onClick = onOpenBackup) {
                    Icon(
                        imageVector = Icons.Default.Storage,
                        contentDescription = "Base de Dados",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
    )
}
