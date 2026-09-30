package com.example.vaniravanessa.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.vaniravanessa.R
import com.example.vaniravanessa.model.*
import com.example.vaniravanessa.ui.components.AppointmentCard
import com.example.vaniravanessa.ui.theme.*
import java.text.NumberFormat
import java.util.*

@Composable
fun DashboardScreen(
    salonName: String,
    selectedDate: String,
    appointments: List<Appointment>,
    transactions: List<PaymentTransaction>,
    onSelectTab: (AdminTab) -> Unit,
    onNewAppointmentClick: () -> Unit,
    onNewClientClick: () -> Unit,
    onNewServiceClick: () -> Unit,
    onStatusChange: (Long, AppointmentStatus) -> Unit,
    onDeleteAppointment: (Long) -> Unit,
    onWhatsAppClick: (String, String) -> Unit,
    onAddToCalendar: (Appointment) -> Unit,
    onOpenBackup: () -> Unit,
    onSharePortal: () -> Unit
) {
    val context = LocalContext.current
    val formatBRL = remember { NumberFormat.getCurrencyInstance(Locale("pt", "BR")) }

    val todayAppointments = appointments.filter { it.dateStr == selectedDate }
        .sortedBy { it.timeStr }
    val totalToday = todayAppointments.size
    val confirmedCount = todayAppointments.count { it.status == AppointmentStatus.CONFIRMADO }
    val pendingCount = todayAppointments.count { it.status == AppointmentStatus.AGUARDANDO }
    val canceledCount = todayAppointments.count { it.status == AppointmentStatus.CANCELADO }

    val todayRevenue = transactions.filter { it.status == PaymentStatus.PAGO && it.dateStr == selectedDate }
        .sumOf { it.amount }
    val monthRevenue = transactions.filter { it.status == PaymentStatus.PAGO }.sumOf { it.amount }
    val pendingReceivable = transactions.filter { it.status == PaymentStatus.PENDENTE }.sumOf { it.amount }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 8.dp, bottom = 24.dp)
    ) {
        // Hero Visual Banner
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color(0xFF2A081D))
            ) {
                Image(
                    painter = painterResource(id = R.drawable.salon_hero_banner),
                    contentDescription = salonName,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize(),
                    alpha = 0.65f
                )
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color.Transparent, Color(0xDD2A081D)),
                                startY = 50f
                            )
                        )
                )
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text("💇‍♀️", fontSize = 20.sp)
                        Text(
                            text = salonName,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }
                    Text(
                        text = "Painel de Controle • Gestão Integrada do Salão",
                        fontSize = 12.sp,
                        color = Color(0xFFFFD8E6),
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        // WhatsApp Client Portal Invitation Banner
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFFE8F5E9)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text("📲", fontSize = 18.sp)
                        Text(
                            text = "Portal do Salão para Clientes",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 14.sp,
                            color = Color(0xFF1B5E20)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Compartilhe o portal para seus clientes agendarem horários diretamente com confirmação rápida.",
                        fontSize = 12.sp,
                        color = Color(0xFF2E7D32)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = onSharePortal,
                        colors = ButtonDefaults.buttonColors(containerColor = WhatsAppGreen),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Enviar Link do Salão no WhatsApp", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color.White)
                    }
                }
            }
        }

        // Today's Stats
        item {
            Column {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.padding(bottom = 8.dp)
                ) {
                    Text(
                        text = "Hoje",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "($selectedDate)",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    StatCard(
                        count = totalToday,
                        label = "atendimentos",
                        icon = "🟣",
                        modifier = Modifier.weight(1f),
                        color = BellaWinePrimary
                    )
                    StatCard(
                        count = confirmedCount,
                        label = "confirmados",
                        icon = "🟢",
                        modifier = Modifier.weight(1f),
                        color = StatusConfirmed
                    )
                    StatCard(
                        count = pendingCount,
                        label = "aguardando",
                        icon = "🟠",
                        modifier = Modifier.weight(1f),
                        color = StatusPending
                    )
                    StatCard(
                        count = canceledCount,
                        label = "cancelados",
                        icon = "🔴",
                        modifier = Modifier.weight(1f),
                        color = StatusCanceled
                    )
                }
            }
        }

        // Financial Overview Cards
        item {
            Column {
                Text(
                    text = "Faturamento & Caixa",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        ),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "FATURAMENTO MÊS",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                                )
                                Icon(
                                    Icons.Default.TrendingUp,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = BellaWinePrimary
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = formatBRL.format(monthRevenue),
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = BellaWinePrimary
                            )
                            Text(
                                text = "Hoje: ${formatBRL.format(todayRevenue)}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }

                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        ),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "CONTAS A RECEBER",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                )
                                Icon(
                                    Icons.Default.AttachMoney,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = StatusPending
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = formatBRL.format(pendingReceivable),
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "Pendências a confirmar",
                                fontSize = 11.sp,
                                color = StatusPending,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }
        }

        // Quick Actions
        item {
            Column {
                Text(
                    text = "Ações Rápidas",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    QuickActionButton(
                        icon = Icons.Default.Add,
                        label = "Novo Agendamento",
                        modifier = Modifier.weight(1f),
                        onClick = onNewAppointmentClick
                    )
                    QuickActionButton(
                        icon = Icons.Default.PersonAdd,
                        label = "Novo Cliente",
                        modifier = Modifier.weight(1f),
                        onClick = onNewClientClick
                    )
                    QuickActionButton(
                        icon = Icons.Default.ContentCut,
                        label = "Novo Serviço",
                        modifier = Modifier.weight(1f),
                        onClick = onNewServiceClick
                    )
                    QuickActionButton(
                        icon = Icons.Default.AutoAwesome,
                        label = "IA Consultora",
                        modifier = Modifier.weight(1f),
                        onClick = { onSelectTab(AdminTab.IA_ASSISTENTE) }
                    )
                }
            }
        }

        // Upcoming Today Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "Próximos Horários de Hoje",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = MaterialTheme.colorScheme.primaryContainer
                    ) {
                        Text(
                            text = "$totalToday",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = BellaWinePrimary,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                Text(
                    text = "Ver Agenda →",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = BellaWinePrimary,
                    modifier = Modifier.clickable { onSelectTab(AdminTab.AGENDA) }
                )
            }
        }

        if (todayAppointments.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Default.CalendarToday,
                            contentDescription = null,
                            modifier = Modifier.size(36.dp),
                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Nenhum agendamento para hoje ainda.",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                        Text(
                            text = "Toque em '+ Novo Agendamento' para marcar.",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                        )
                    }
                }
            }
        } else {
            items(todayAppointments, key = { it.id }) { app ->
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

@Composable
private fun StatCard(
    count: Int,
    label: String,
    icon: String,
    modifier: Modifier = Modifier,
    color: Color
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(icon, fontSize = 16.sp)
            Text(
                text = String.format("%02d", count),
                fontWeight = FontWeight.Black,
                fontSize = 16.sp,
                color = color
            )
            Text(
                text = label,
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
private fun QuickActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 1.dp,
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier.padding(vertical = 10.dp, horizontal = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = label,
                    tint = BellaWinePrimary,
                    modifier = Modifier.size(18.dp)
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 1
            )
        }
    }
}
