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
import com.example.vaniravanessa.ui.components.AppointmentCard
import com.example.vaniravanessa.ui.theme.BellaWinePrimary
import com.example.vaniravanessa.ui.theme.StatusCanceled
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ScheduleScreen(
    salonName: String,
    selectedDate: String,
    onSelectDate: (String) -> Unit,
    selectedProfFilter: Long?,
    onSelectProfFilter: (Long?) -> Unit,
    professionals: List<Professional>,
    appointments: List<Appointment>,
    blocks: List<ScheduleBlock>,
    onNewAppointmentClick: () -> Unit,
    onStatusChange: (Long, AppointmentStatus) -> Unit,
    onDeleteAppointment: (Long) -> Unit,
    onWhatsAppClick: (String, String) -> Unit,
    onAddToCalendar: (Appointment) -> Unit
) {
    val sdf = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()) }
    val displayFormat = remember { SimpleDateFormat("dd/MM", Locale.getDefault()) }
    val dayOfWeekFormat = remember { SimpleDateFormat("EEE", Locale("pt", "BR")) }

    // Generate 7 days starting from today
    val daysList = remember {
        val cal = Calendar.getInstance()
        (0..6).map { offset ->
            if (offset > 0) cal.add(Calendar.DAY_OF_YEAR, 1)
            val dStr = sdf.format(cal.time)
            val dDisp = displayFormat.format(cal.time)
            val dow = dayOfWeekFormat.format(cal.time).uppercase()
            Triple(dStr, dDisp, dow)
        }
    }

    val filteredAppointments = appointments.filter { app ->
        app.dateStr == selectedDate && (selectedProfFilter == null || app.professionalId == selectedProfFilter)
    }.sortedBy { it.timeStr }

    val filteredBlocks = blocks.filter { block ->
        block.dateStr == selectedDate && (selectedProfFilter == null || block.professionalId == selectedProfFilter)
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNewAppointmentClick,
                containerColor = BellaWinePrimary,
                contentColor = Color.White,
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(modifier = Modifier.padding(horizontal = 14.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Add, contentDescription = "Novo Horário")
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Agendar", fontWeight = FontWeight.Bold)
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Day selector tabs
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(daysList) { (dStr, dDisp, dow) ->
                    val isSelected = dStr == selectedDate
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = if (isSelected) BellaWinePrimary else MaterialTheme.colorScheme.surface,
                        shadowElevation = if (isSelected) 2.dp else 0.dp,
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .clickable { onSelectDate(dStr) }
                    ) {
                        Column(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = dow,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White.copy(alpha = 0.8f) else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                            Text(
                                text = dDisp,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Black,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
            }

            // Professional Filter Chips
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                item {
                    FilterChip(
                        selected = selectedProfFilter == null,
                        onClick = { onSelectProfFilter(null) },
                        label = { Text("Todos (${professionals.size})", fontSize = 12.sp) }
                    )
                }
                items(professionals) { prof ->
                    FilterChip(
                        selected = selectedProfFilter == prof.id,
                        onClick = { onSelectProfFilter(prof.id) },
                        label = { Text("${prof.avatarEmoji} ${prof.name}", fontSize = 12.sp) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Appointments List
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                // Blocks item
                if (filteredBlocks.isNotEmpty()) {
                    items(filteredBlocks) { block ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF3E0)),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(Icons.Default.Block, contentDescription = null, tint = Color(0xFFE65100))
                                Column {
                                    Text(
                                        text = "Bloqueio de Agenda (${block.startTime} - ${block.endTime})",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = Color(0xFFE65100)
                                    )
                                    Text(
                                        text = block.reason,
                                        fontSize = 12.sp,
                                        color = Color(0xFFBF360C)
                                    )
                                }
                            }
                        }
                    }
                }

                if (filteredAppointments.isEmpty() && filteredBlocks.isEmpty()) {
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(40.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text("📅", fontSize = 32.sp)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "Nenhum horário agendado",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = "Toque em '+ Agendar' abaixo para marcar uma cliente.",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                                )
                            }
                        }
                    }
                } else {
                    items(filteredAppointments, key = { it.id }) { app ->
                        AppointmentCard(
                            appointment = app,
                            onStatusChange = onStatusChange,
                            onWhatsAppClick = onWhatsAppClick,
                            onAddToCalendar = onAddToCalendar,
                            onDeleteClick = onDeleteAppointment,
                            salonName = salonName
                        )
                    }
                }
            }
        }
    }
}
