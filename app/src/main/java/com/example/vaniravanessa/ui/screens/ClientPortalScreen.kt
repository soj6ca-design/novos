package com.example.vaniravanessa.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import com.example.vaniravanessa.model.*
import com.example.vaniravanessa.ui.theme.*
import java.text.NumberFormat
import java.util.*

@Composable
fun ClientPortalScreen(
    salonName: String,
    currentTab: ClientPortalTab,
    onSelectTab: (ClientPortalTab) -> Unit,
    services: List<SalonService>,
    professionals: List<Professional>,
    appointments: List<Appointment>,
    selectedDate: String,
    onBookAppointment: (clientName: String, clientPhone: String, service: SalonService, prof: Professional, dateStr: String, timeStr: String, notes: String) -> Boolean,
    onCancelAppointment: (Long) -> Unit,
    onWhatsAppClick: (String, String) -> Unit,
    onSharePortal: () -> Unit
) {
    val formatBRL = remember { NumberFormat.getCurrencyInstance(Locale("pt", "BR")) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        // Portal Banner
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = BellaWinePrimary),
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("💇‍♀️", fontSize = 22.sp)
                    Text(
                        text = salonName,
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                }
                Text(
                    text = "Agende seu horário com Vanira e Vanessa com confirmação imediata.",
                    fontSize = 12.sp,
                    color = Color(0xFFFFD8E6),
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }

        // Subtabs for Client Portal
        ScrollableTabRow(
            selectedTabIndex = currentTab.ordinal,
            edgePadding = 0.dp,
            containerColor = Color.Transparent,
            divider = {},
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            ClientPortalTab.values().forEach { tab ->
                Tab(
                    selected = currentTab == tab,
                    onClick = { onSelectTab(tab) },
                    text = {
                        Text(
                            text = tab.title,
                            fontWeight = if (currentTab == tab) FontWeight.Bold else FontWeight.Normal,
                            fontSize = 13.sp
                        )
                    }
                )
            }
        }

        when (currentTab) {
            ClientPortalTab.AGENDAR -> {
                BookingWizard(
                    services = services,
                    professionals = professionals,
                    initialDate = selectedDate,
                    formatBRL = formatBRL,
                    salonName = salonName,
                    onBook = onBookAppointment,
                    onWhatsAppClick = onWhatsAppClick
                )
            }
            ClientPortalTab.MEUS_AGENDAMENTOS -> {
                MyAppointmentsView(
                    appointments = appointments,
                    salonName = salonName,
                    formatBRL = formatBRL,
                    onCancel = onCancelAppointment,
                    onWhatsAppClick = onWhatsAppClick
                )
            }
            ClientPortalTab.CONSULTORA_IA -> {
                HairConsultationView(salonName = salonName)
            }
            ClientPortalTab.COMPARTILHAR -> {
                ShareAppView(salonName = salonName, onShare = onSharePortal)
            }
        }
    }
}

@Composable
private fun BookingWizard(
    services: List<SalonService>,
    professionals: List<Professional>,
    initialDate: String,
    formatBRL: NumberFormat,
    salonName: String,
    onBook: (String, String, SalonService, Professional, String, String, String) -> Boolean,
    onWhatsAppClick: (String, String) -> Unit
) {
    var step by remember { mutableStateOf(1) } // 1: Serviço, 2: Profissional, 3: Data & Hora, 4: Seus Dados, 5: Sucesso
    var selectedService by remember { mutableStateOf(services.firstOrNull()) }
    var selectedProfessional by remember { mutableStateOf(professionals.firstOrNull()) }
    var dateStr by remember { mutableStateOf(initialDate) }
    var timeStr by remember { mutableStateOf("10:00") }
    var clientName by remember { mutableStateOf("") }
    var clientPhone by remember { mutableStateOf("") }
    var clientNotes by remember { mutableStateOf("") }
    var conflictError by remember { mutableStateOf<String?>(null) }

    val times = listOf("08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00")

    Column(modifier = Modifier.fillMaxSize()) {
        // Step Indicator
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            (1..4).forEach { s ->
                val active = step >= s
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (active) BellaWinePrimary else MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "$s",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = if (active) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        when (step) {
            1 -> {
                Text("Passo 1: Escolha o Serviço", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                LazyColumn(
                    modifier = Modifier.weight(1f).padding(top = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(services, key = { it.id }) { s ->
                        val isSelected = selectedService?.id == s.id
                        Card(
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
                            ),
                            modifier = Modifier.fillMaxWidth().clickable { selectedService = s }
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(s.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(s.description, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f), maxLines = 2)
                                    Text("${s.durationMinutes} min", fontSize = 11.sp, color = BellaWinePrimary, fontWeight = FontWeight.Medium)
                                }
                                Text(formatBRL.format(s.price), fontWeight = FontWeight.Black, fontSize = 15.sp, color = BellaWinePrimary)
                            }
                        }
                    }
                }
                Button(
                    onClick = { step = 2 },
                    enabled = selectedService != null,
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)
                ) {
                    Text("Avançar para Profissional")
                }
            }
            2 -> {
                Text("Passo 2: Escolha a Profissional", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                LazyColumn(
                    modifier = Modifier.weight(1f).padding(top = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(professionals, key = { it.id }) { p ->
                        val isSelected = selectedProfessional?.id == p.id
                        Card(
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
                            ),
                            modifier = Modifier.fillMaxWidth().clickable { selectedProfessional = p }
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Text(p.avatarEmoji, fontSize = 24.sp)
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(p.name, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                    Text(p.role, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                                    Text("${p.rating} ★★★★★", fontSize = 11.sp, color = BellaGold, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { step = 1 }, modifier = Modifier.weight(1f)) { Text("Voltar") }
                    Button(onClick = { step = 3 }, enabled = selectedProfessional != null, modifier = Modifier.weight(1f), colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)) {
                        Text("Avançar")
                    }
                }
            }
            3 -> {
                Text("Passo 3: Data e Horário", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Column(modifier = Modifier.weight(1f).padding(top = 8.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = dateStr,
                        onValueChange = { dateStr = it },
                        label = { Text("Data (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Text("Selecione o Horário:", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(times) { t ->
                            FilterChip(
                                selected = timeStr == t,
                                onClick = { timeStr = t },
                                label = { Text(t) }
                            )
                        }
                    }

                    if (conflictError != null) {
                        Text(conflictError!!, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                    }
                }
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { step = 2 }, modifier = Modifier.weight(1f)) { Text("Voltar") }
                    Button(onClick = { step = 4 }, modifier = Modifier.weight(1f), colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)) {
                        Text("Avançar")
                    }
                }
            }
            4 -> {
                Text("Passo 4: Seus Dados", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Column(modifier = Modifier.weight(1f).padding(top = 8.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(value = clientName, onValueChange = { clientName = it }, label = { Text("Seu Nome Completo *") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = clientPhone, onValueChange = { clientPhone = it }, label = { Text("Seu WhatsApp (com DDD) *") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = clientNotes, onValueChange = { clientNotes = it }, label = { Text("Tipo de Cabelo ou Observação") }, modifier = Modifier.fillMaxWidth())

                    if (conflictError != null) {
                        Text(conflictError!!, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                    }
                }
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { step = 3 }, modifier = Modifier.weight(1f)) { Text("Voltar") }
                    Button(
                        onClick = {
                            val s = selectedService
                            val p = selectedProfessional
                            if (clientName.isBlank() || clientPhone.isBlank() || s == null || p == null) {
                                conflictError = "Por favor preencha seu nome e WhatsApp."
                                return@Button
                            }
                            val success = onBook(clientName, clientPhone, s, p, dateStr, timeStr, clientNotes)
                            if (success) {
                                step = 5
                            } else {
                                conflictError = "Horário indisponível! Escolha outro horário no Passo 3."
                            }
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)
                    ) {
                        Text("Confirmar Horário")
                    }
                }
            }
            5 -> {
                // Success screen
                Column(
                    modifier = Modifier.fillMaxSize().padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text("🎉", fontSize = 48.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Agendamento Confirmado!", fontWeight = FontWeight.Black, fontSize = 20.sp, color = BellaWinePrimary)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Seu horário foi reservado com sucesso no $salonName.",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text("📋 Resumo do Agendamento", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("• Serviço: ${selectedService?.name}")
                            Text("• Profissional: ${selectedProfessional?.name}")
                            Text("• Data: $dateStr às $timeStr")
                            Text("• Valor: ${formatBRL.format(selectedService?.price ?: 0.0)}")
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))
                    Button(
                        onClick = {
                            val msg = "Olá! Acabei de agendar meu horário de ${selectedService?.name} com ${selectedProfessional?.name} para o dia $dateStr às $timeStr pelo aplicativo do $salonName!"
                            onWhatsAppClick(clientPhone, msg)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = WhatsAppGreen),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().height(44.dp)
                    ) {
                        Icon(Icons.Default.Chat, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Notificar Salão via WhatsApp", fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    TextButton(onClick = { step = 1 }) {
                        Text("Fazer Outro Agendamento")
                    }
                }
            }
        }
    }
}

@Composable
private fun MyAppointmentsView(
    appointments: List<Appointment>,
    salonName: String,
    formatBRL: NumberFormat,
    onCancel: (Long) -> Unit,
    onWhatsAppClick: (String, String) -> Unit
) {
    var phoneInput by remember { mutableStateOf("") }
    val myAppointments = remember(appointments, phoneInput) {
        val clean = phoneInput.replace(Regex("[^0-9]"), "")
        if (clean.length < 8) emptyList()
        else appointments.filter { it.clientPhone.contains(clean) }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Text("Consulte seus horários agendados:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        OutlinedTextField(
            value = phoneInput,
            onValueChange = { phoneInput = it },
            label = { Text("Digite seu telefone / WhatsApp") },
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            shape = RoundedCornerShape(12.dp)
        )

        if (phoneInput.length >= 8 && myAppointments.isEmpty()) {
            Text("Nenhum agendamento encontrado para este número.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f))
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(myAppointments, key = { it.id }) { app ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(app.serviceName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(app.status.label, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = BellaWinePrimary)
                        }
                        Text("Profissional: ${app.professionalName}", fontSize = 12.sp)
                        Text("Data: ${app.dateStr} às ${app.timeStr}", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(
                                onClick = { onCancel(app.id) },
                                modifier = Modifier.weight(1f).height(34.dp),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("Cancelar", fontSize = 11.sp, color = MaterialTheme.colorScheme.error)
                            }
                            Button(
                                onClick = {
                                    val msg = "Olá! Gostaria de falar sobre meu agendamento de ${app.serviceName} no dia ${app.dateStr} às ${app.timeStr} no $salonName."
                                    onWhatsAppClick(app.clientPhone, msg)
                                },
                                modifier = Modifier.weight(1f).height(34.dp),
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = WhatsAppGreen)
                            ) {
                                Text("WhatsApp", fontSize = 11.sp, color = Color.White)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HairConsultationView(salonName: String) {
    val tips = listOf(
        "✨ Cronograma Capilar: Alterne hidratação semanal com nutrição e reconstrução a cada 15 dias.",
        "🎨 Cabelos com Mechas: Utilize protetor térmico antes da escova e lave com shampoo livre de sulfato.",
        "💆‍♀️ Cuidados Pós-Química: Evite prender com elásticos apertados nos primeiros dias após alisamentos ou progressivas.",
        "🌸 Agendamento Periódico: Para manter o corte visagista com caimento impecável, apare as pontas a cada 60 a 90 dias."
    )

    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item {
            Text("Dicas & Cuidados dos Especialistas", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = BellaWinePrimary)
            Text("Recomendações exclusivas da Vanira e Vanessa para seus fios brilharem todos os dias:", fontSize = 12.sp, modifier = Modifier.padding(bottom = 6.dp))
        }

        items(tips) { tip ->
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = tip,
                    fontSize = 13.sp,
                    lineHeight = 18.sp,
                    modifier = Modifier.padding(14.dp)
                )
            }
        }
    }
}

@Composable
private fun ShareAppView(salonName: String, onShare: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("📲", fontSize = 48.sp)
        Spacer(modifier = Modifier.height(10.dp))
        Text("Compartilhe o $salonName", fontWeight = FontWeight.Black, fontSize = 18.sp)
        Text(
            text = "Envie o convite do salão para suas amigas e familiares agendarem com facilidade!",
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = onShare,
            colors = ButtonDefaults.buttonColors(containerColor = WhatsAppGreen),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.fillMaxWidth().height(46.dp)
        ) {
            Icon(Icons.Default.Share, contentDescription = null, tint = Color.White)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Enviar pelo WhatsApp", fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}
