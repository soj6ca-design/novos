package com.example.vaniravanessa.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.example.vaniravanessa.model.Appointment
import com.example.vaniravanessa.model.AppointmentStatus
import com.example.vaniravanessa.ui.theme.*
import java.text.NumberFormat
import java.util.*

@Composable
fun AppointmentCard(
    appointment: Appointment,
    onStatusChange: (Long, AppointmentStatus) -> Unit,
    onWhatsAppClick: (String, String) -> Unit,
    onAddToCalendar: (Appointment) -> Unit,
    onDeleteClick: (Long) -> Unit,
    salonName: String
) {
    val formatBRL = remember { NumberFormat.getCurrencyInstance(Locale("pt", "BR")) }
    var menuExpanded by remember { mutableStateOf(false) }

    val statusColor = when (appointment.status) {
        AppointmentStatus.CONFIRMADO -> StatusConfirmed
        AppointmentStatus.AGUARDANDO -> StatusPending
        AppointmentStatus.CONCLUIDO -> StatusCompleted
        AppointmentStatus.CANCELADO -> StatusCanceled
        AppointmentStatus.BLOQUEIO -> Color.Gray
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // Header Row: Time, Status Badge & Menu
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.primaryContainer
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Schedule,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp),
                                tint = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = appointment.timeStr,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }

                    Text(
                        text = "${appointment.durationMinutes} min",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = statusColor.copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = appointment.status.label,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = statusColor,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }

                    Box {
                        IconButton(
                            onClick = { menuExpanded = true },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.MoreVert,
                                contentDescription = "Opções",
                                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                            )
                        }

                        DropdownMenu(
                            expanded = menuExpanded,
                            onDismissRequest = { menuExpanded = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Confirmar") },
                                onClick = {
                                    onStatusChange(appointment.id, AppointmentStatus.CONFIRMADO)
                                    menuExpanded = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Concluir Atendimento") },
                                onClick = {
                                    onStatusChange(appointment.id, AppointmentStatus.CONCLUIDO)
                                    menuExpanded = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Cancelar") },
                                onClick = {
                                    onStatusChange(appointment.id, AppointmentStatus.CANCELADO)
                                    menuExpanded = false
                                }
                            )
                            HorizontalDivider()
                            DropdownMenuItem(
                                text = { Text("Excluir", color = MaterialTheme.colorScheme.error) },
                                onClick = {
                                    onDeleteClick(appointment.id)
                                    menuExpanded = false
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Client & Service Details
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = appointment.clientName,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = appointment.serviceName,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f)
                    )
                    Row(
                        modifier = Modifier.padding(top = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text("💇", fontSize = 12.sp)
                        Text(
                            text = appointment.professionalName,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = BellaWinePrimary
                        )
                    }
                }

                Text(
                    text = formatBRL.format(appointment.price),
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp,
                    color = BellaWinePrimary
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Action Buttons: WhatsApp & Google Calendar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = {
                        val msg = "Olá, ${appointment.clientName}! Passando para confirmar seu horário de ${appointment.serviceName} no $salonName com ${appointment.professionalName} no dia ${appointment.dateStr} às ${appointment.timeStr}. Te esperamos!"
                        onWhatsAppClick(appointment.clientPhone, msg)
                    },
                    modifier = Modifier.weight(1f).height(38.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = WhatsAppGreen
                    ),
                    contentPadding = PaddingValues(horizontal = 8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Chat,
                        contentDescription = "WhatsApp",
                        modifier = Modifier.size(16.dp),
                        tint = Color.White
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("WhatsApp", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }

                OutlinedButton(
                    onClick = { onAddToCalendar(appointment) },
                    modifier = Modifier.weight(1f).height(38.dp),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Event,
                        contentDescription = "Calendário",
                        modifier = Modifier.size(16.dp),
                        tint = BellaWinePrimary
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Agenda", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = BellaWinePrimary)
                }
            }
        }
    }
}
