package com.example.vaniravanessa.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.vaniravanessa.model.*
import com.example.vaniravanessa.ui.theme.BellaWinePrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NewAppointmentDialog(
    services: List<SalonService>,
    professionals: List<Professional>,
    currentDate: String,
    onDismiss: () -> Unit,
    onConfirm: (clientName: String, clientPhone: String, service: SalonService, professional: Professional, dateStr: String, timeStr: String, notes: String) -> Boolean
) {
    var clientName by remember { mutableStateOf("") }
    var clientPhone by remember { mutableStateOf("") }
    var selectedService by remember { mutableStateOf(services.firstOrNull()) }
    var selectedProfessional by remember { mutableStateOf(professionals.firstOrNull()) }
    var dateStr by remember { mutableStateOf(currentDate) }
    var timeStr by remember { mutableStateOf("10:00") }
    var notes by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val times = listOf("08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00")

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Novo Agendamento", fontWeight = FontWeight.Bold) },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (errorMessage != null) {
                    Text(errorMessage!!, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                }

                OutlinedTextField(
                    value = clientName,
                    onValueChange = { clientName = it },
                    label = { Text("Nome da Cliente *") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = clientPhone,
                    onValueChange = { clientPhone = it },
                    label = { Text("WhatsApp (com DDD) *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier.fillMaxWidth()
                )

                Text("Serviço:", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                var serviceMenuExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = serviceMenuExpanded,
                    onExpandedChange = { serviceMenuExpanded = !serviceMenuExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedService?.let { "${it.name} - R$ ${it.price}" } ?: "Selecione",
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = serviceMenuExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = serviceMenuExpanded,
                        onDismissRequest = { serviceMenuExpanded = false }
                    ) {
                        services.forEach { s ->
                            DropdownMenuItem(
                                text = { Text("${s.name} - R$ ${s.price}") },
                                onClick = {
                                    selectedService = s
                                    serviceMenuExpanded = false
                                }
                            )
                        }
                    }
                }

                Text("Profissional:", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                var profMenuExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = profMenuExpanded,
                    onExpandedChange = { profMenuExpanded = !profMenuExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedProfessional?.let { "${it.avatarEmoji} ${it.name} (${it.role})" } ?: "Selecione",
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = profMenuExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = profMenuExpanded,
                        onDismissRequest = { profMenuExpanded = false }
                    ) {
                        professionals.forEach { p ->
                            DropdownMenuItem(
                                text = { Text("${p.avatarEmoji} ${p.name} (${p.role})") },
                                onClick = {
                                    selectedProfessional = p
                                    profMenuExpanded = false
                                }
                            )
                        }
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = dateStr,
                        onValueChange = { dateStr = it },
                        label = { Text("Data (YYYY-MM-DD)") },
                        modifier = Modifier.weight(1f)
                    )

                    var timeExpanded by remember { mutableStateOf(false) }
                    Box(modifier = Modifier.weight(1f)) {
                        OutlinedTextField(
                            value = timeStr,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Horário") },
                            trailingIcon = {
                                IconButton(onClick = { timeExpanded = true }) {
                                    Icon(Icons.Default.Schedule, contentDescription = null)
                                }
                            },
                            modifier = Modifier.fillMaxWidth().clickable { timeExpanded = true }
                        )
                        DropdownMenu(expanded = timeExpanded, onDismissRequest = { timeExpanded = false }) {
                            times.forEach { t ->
                                DropdownMenuItem(
                                    text = { Text(t) },
                                    onClick = {
                                        timeStr = t
                                        timeExpanded = false
                                    }
                                )
                            }
                        }
                    }
                }

                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Observações (opcional)") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (clientName.isBlank() || clientPhone.isBlank()) {
                        errorMessage = "Preencha o nome e o WhatsApp da cliente."
                        return@Button
                    }
                    val s = selectedService
                    val p = selectedProfessional
                    if (s == null || p == null) {
                        errorMessage = "Selecione serviço e profissional."
                        return@Button
                    }
                    val success = onConfirm(clientName, clientPhone, s, p, dateStr, timeStr, notes)
                    if (!success) {
                        errorMessage = "Conflito! O profissional já possui atendimento neste horário."
                    } else {
                        onDismiss()
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)
            ) {
                Text("Confirmar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar") }
        }
    )
}

@Composable
fun NewClientDialog(
    initialClient: Client? = null,
    onDismiss: () -> Unit,
    onSave: (name: String, phone: String, birthDate: String, address: String, hairPref: String, notes: String) -> Unit
) {
    var name by remember { mutableStateOf(initialClient?.name ?: "") }
    var phone by remember { mutableStateOf(initialClient?.phone ?: "") }
    var birthDate by remember { mutableStateOf(initialClient?.birthDate ?: "") }
    var address by remember { mutableStateOf(initialClient?.address ?: "") }
    var hairPreferences by remember { mutableStateOf(initialClient?.hairPreferences ?: "") }
    var notes by remember { mutableStateOf(initialClient?.notes ?: "") }
    var error by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (initialClient == null) "Novo Cliente" else "Editar Cliente", fontWeight = FontWeight.Bold) },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (error != null) {
                    Text(error!!, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                }
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Nome Completo *") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Telefone / WhatsApp *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = birthDate,
                    onValueChange = { birthDate = it },
                    label = { Text("Data de Nascimento (DD/MM/AAAA)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = address,
                    onValueChange = { address = it },
                    label = { Text("Endereço") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = hairPreferences,
                    onValueChange = { hairPreferences = it },
                    label = { Text("Preferências & Tipo de Cabelo") },
                    placeholder = { Text("Ex: Ondulado 2B, mechas douradas, couro sensível") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Observações Gerais") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isBlank() || phone.isBlank()) {
                        error = "Nome e telefone são obrigatórios."
                        return@Button
                    }
                    onSave(name, phone, birthDate, address, hairPreferences, notes)
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)
            ) {
                Text("Salvar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar") }
        }
    )
}

@Composable
fun AdminPinDialog(
    onDismiss: () -> Unit,
    onVerify: (String) -> Boolean,
    onSuccess: () -> Unit
) {
    var pin by remember { mutableStateOf("") }
    var error by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Acesso Restrito ao Painel", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Digite o PIN de segurança para retornar ao modo Administrador (Padrão: 1234):", fontSize = 13.sp)
                OutlinedTextField(
                    value = pin,
                    onValueChange = {
                        pin = it
                        error = false
                    },
                    label = { Text("PIN de 4 Dígitos") },
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                    isError = error,
                    modifier = Modifier.fillMaxWidth()
                )
                if (error) {
                    Text("PIN incorreto. Tente novamente.", color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (onVerify(pin)) {
                        onSuccess()
                        onDismiss()
                    } else {
                        error = true
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)
            ) {
                Text("Entrar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar") }
        }
    )
}

@Composable
fun EditSalonNameDialog(
    currentName: String,
    onDismiss: () -> Unit,
    onSave: (String) -> Unit
) {
    var name by remember { mutableStateOf(currentName) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Editar Nome do Salão", fontWeight = FontWeight.Bold) },
        text = {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Nome do Salão") },
                modifier = Modifier.fillMaxWidth()
            )
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        onSave(name)
                        onDismiss()
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)
            ) {
                Text("Salvar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar") }
        }
    )
}

@Composable
fun BackupDialog(
    onDismiss: () -> Unit,
    onResetData: () -> Unit
) {
    var showResetConfirm by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Base de Dados & Segurança", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Seus dados estão armazenados localmente e sincronizados em tempo real.", fontSize = 13.sp)
                if (showResetConfirm) {
                    Text(
                        "Tem certeza de que deseja restaurar os dados iniciais? Todas as modificações recentes serão redefinidas para a base de demonstração do salão.",
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        },
        confirmButton = {
            if (!showResetConfirm) {
                Button(
                    onClick = { showResetConfirm = true },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Restaurar Base Padrão")
                }
            } else {
                Button(
                    onClick = {
                        onResetData()
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Confirmar Reset")
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Fechar") }
        }
    )
}
