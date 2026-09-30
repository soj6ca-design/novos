package com.example.vaniravanessa.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.vaniravanessa.model.PaymentMethod
import com.example.vaniravanessa.model.PaymentStatus
import com.example.vaniravanessa.model.PaymentTransaction
import com.example.vaniravanessa.ui.theme.*
import java.text.NumberFormat
import java.util.*

@Composable
fun FinancialScreen(
    transactions: List<PaymentTransaction>,
    onMarkPaid: (Long, PaymentMethod) -> Unit,
    onAddTransaction: (client: String, service: String, amount: Double, method: PaymentMethod, status: PaymentStatus, dueDate: String?) -> Unit
) {
    var statusFilter by remember { mutableStateOf("TODOS") }
    val formatBRL = remember { NumberFormat.getCurrencyInstance(Locale("pt", "BR")) }
    var selectedTxForPayment by remember { mutableStateOf<PaymentTransaction?>(null) }
    var showAddDialog by remember { mutableStateOf(false) }

    val totalPaid = transactions.filter { it.status == PaymentStatus.PAGO }.sumOf { it.amount }
    val totalPending = transactions.filter { it.status == PaymentStatus.PENDENTE }.sumOf { it.amount }

    val filteredTransactions = remember(transactions, statusFilter) {
        when (statusFilter) {
            "PAGO" -> transactions.filter { it.status == PaymentStatus.PAGO }
            "PENDENTE" -> transactions.filter { it.status == PaymentStatus.PENDENTE }
            else -> transactions
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = BellaWinePrimary,
                contentColor = Color.White,
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(modifier = Modifier.padding(horizontal = 14.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Add, contentDescription = "Nova Transação")
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Lançar", fontWeight = FontWeight.Bold)
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
        ) {
            // Metrics Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("TOTAL PAGO", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = BellaWinePrimary)
                        Text(formatBRL.format(totalPaid), fontSize = 16.sp, fontWeight = FontWeight.Black, color = BellaWinePrimary)
                    }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF3E0))
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("A RECEBER", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFE65100))
                        Text(formatBRL.format(totalPending), fontSize = 16.sp, fontWeight = FontWeight.Black, color = Color(0xFFE65100))
                    }
                }
            }

            // Filter Tabs
            Row(
                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("TODOS", "PAGO", "PENDENTE").forEach { filter ->
                    FilterChip(
                        selected = statusFilter == filter,
                        onClick = { statusFilter = filter },
                        label = {
                            Text(
                                when (filter) {
                                    "PAGO" -> "Pagos"
                                    "PENDENTE" -> "Pendentes"
                                    else -> "Todos"
                                }
                            )
                        }
                    )
                }
            }

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                items(filteredTransactions, key = { it.id }) { tx ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(tx.clientName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text(tx.serviceName, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                                Row(
                                    modifier = Modifier.padding(top = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = if (tx.status == PaymentStatus.PAGO) StatusConfirmed.copy(alpha = 0.15f) else StatusPending.copy(alpha = 0.15f)
                                    ) {
                                        Text(
                                            text = tx.status.label,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (tx.status == PaymentStatus.PAGO) StatusConfirmed else StatusPending,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                    Text("• ${tx.paymentMethod.label}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                                }
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = formatBRL.format(tx.amount),
                                    fontWeight = FontWeight.Black,
                                    fontSize = 16.sp,
                                    color = if (tx.status == PaymentStatus.PAGO) StatusConfirmed else StatusPending
                                )

                                if (tx.status == PaymentStatus.PENDENTE) {
                                    Button(
                                        onClick = { selectedTxForPayment = tx },
                                        shape = RoundedCornerShape(8.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = StatusConfirmed),
                                        modifier = Modifier.height(32.dp).padding(top = 4.dp),
                                        contentPadding = PaddingValues(horizontal = 8.dp)
                                    ) {
                                        Text("Receber", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Payment Method Selection Dialog
    if (selectedTxForPayment != null) {
        val tx = selectedTxForPayment!!
        var chosenMethod by remember { mutableStateOf(PaymentMethod.PIX) }

        AlertDialog(
            onDismissRequest = { selectedTxForPayment = null },
            title = { Text("Confirmar Pagamento", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Cliente: ${tx.clientName}", fontSize = 13.sp)
                    Text("Valor: ${formatBRL.format(tx.amount)}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Forma de Pagamento:", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)

                    listOf(PaymentMethod.PIX, PaymentMethod.CARTAO_CREDITO, PaymentMethod.CARTAO_DEBITO, PaymentMethod.DINHEIRO).forEach { m ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { chosenMethod = m }
                                .padding(vertical = 4.dp)
                        ) {
                            RadioButton(selected = chosenMethod == m, onClick = { chosenMethod = m })
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(m.label, fontSize = 13.sp)
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        onMarkPaid(tx.id, chosenMethod)
                        selectedTxForPayment = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = StatusConfirmed)
                ) {
                    Text("Confirmar Recebimento")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedTxForPayment = null }) { Text("Cancelar") }
            }
        )
    }

    // Add Custom Transaction Dialog
    if (showAddDialog) {
        var cName by remember { mutableStateOf("") }
        var sName by remember { mutableStateOf("") }
        var valStr by remember { mutableStateOf("") }
        var method by remember { mutableStateOf(PaymentMethod.PIX) }
        var isPaid by remember { mutableStateOf(true) }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Lançar Transação", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = cName, onValueChange = { cName = it }, label = { Text("Nome da Cliente") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = sName, onValueChange = { sName = it }, label = { Text("Serviço / Descrição") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = valStr, onValueChange = { valStr = it }, label = { Text("Valor (R$)") }, modifier = Modifier.fillMaxWidth())
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amount = valStr.replace(",", ".").toDoubleOrNull() ?: 0.0
                        if (cName.isNotBlank() && amount > 0) {
                            onAddTransaction(cName, sName, amount, method, if (isPaid) PaymentStatus.PAGO else PaymentStatus.PENDENTE, null)
                            showAddDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BellaWinePrimary)
                ) {
                    Text("Salvar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) { Text("Cancelar") }
            }
        )
    }
}
