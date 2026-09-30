package com.example.vaniravanessa.ui.screens

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
import com.example.vaniravanessa.model.Product
import com.example.vaniravanessa.ui.theme.BellaWinePrimary
import com.example.vaniravanessa.ui.theme.StatusCanceled
import com.example.vaniravanessa.ui.theme.StatusConfirmed
import java.text.NumberFormat
import java.util.*

@Composable
fun InventoryScreen(
    products: List<Product>,
    onAdjustStock: (Long, Int) -> Unit,
    onAddProduct: (name: String, brand: String, category: String, qty: Int, minStock: Int, cost: Double, sell: Double) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    val formatBRL = remember { NumberFormat.getCurrencyInstance(Locale("pt", "BR")) }
    var showAddDialog by remember { mutableStateOf(false) }

    val filteredProducts = remember(products, searchQuery) {
        if (searchQuery.isBlank()) products
        else products.filter {
            it.name.contains(searchQuery, ignoreCase = true) ||
            it.brand.contains(searchQuery, ignoreCase = true) ||
            it.category.contains(searchQuery, ignoreCase = true)
        }
    }

    val lowStockCount = products.count { it.quantityInStock <= it.minStockAlert }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = BellaWinePrimary,
                contentColor = Color.White,
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(modifier = Modifier.padding(horizontal = 14.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Add, contentDescription = "Novo Produto")
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Novo Produto", fontWeight = FontWeight.Bold)
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
            // Search
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                placeholder = { Text("Buscar produto por nome, marca...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                shape = RoundedCornerShape(16.dp),
                singleLine = true
            )

            if (lowStockCount > 0) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFFFEBEE),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = StatusCanceled)
                        Text(
                            text = "Atenção: $lowStockCount produto(s) com estoque baixo!",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = StatusCanceled
                        )
                    }
                }
            }

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                items(filteredProducts, key = { it.id }) { product ->
                    val isLowStock = product.quantityInStock <= product.minStockAlert

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.Top
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = product.brand,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = BellaWinePrimary
                                    )
                                    Text(
                                        text = product.name,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp
                                    )
                                    Text(
                                        text = "Venda: ${formatBRL.format(product.sellPrice)} • Custo: ${formatBRL.format(product.costPrice)}",
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = if (isLowStock) Color(0xFFFFEBEE) else Color(0xFFE8F5E9)
                                ) {
                                    Text(
                                        text = "${product.quantityInStock} em estoque",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isLowStock) StatusCanceled else StatusConfirmed,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Alerta mín: ${product.minStockAlert} un.",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                                )

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    FilledTonalIconButton(
                                        onClick = { onAdjustStock(product.id, -1) },
                                        modifier = Modifier.size(34.dp)
                                    ) {
                                        Icon(Icons.Default.Remove, contentDescription = "Diminuir", modifier = Modifier.size(16.dp))
                                    }

                                    Text(
                                        text = "${product.quantityInStock}",
                                        fontWeight = FontWeight.Black,
                                        fontSize = 14.sp,
                                        modifier = Modifier.padding(horizontal = 4.dp)
                                    )

                                    FilledTonalIconButton(
                                        onClick = { onAdjustStock(product.id, 1) },
                                        modifier = Modifier.size(34.dp)
                                    ) {
                                        Icon(Icons.Default.Add, contentDescription = "Aumentar", modifier = Modifier.size(16.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        var name by remember { mutableStateOf("") }
        var brand by remember { mutableStateOf("") }
        var category by remember { mutableStateOf("Tratamento") }
        var qtyStr by remember { mutableStateOf("5") }
        var costStr by remember { mutableStateOf("50.0") }
        var sellStr by remember { mutableStateOf("95.0") }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Novo Produto", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Nome do Produto") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = brand, onValueChange = { brand = it }, label = { Text("Marca") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = qtyStr, onValueChange = { qtyStr = it }, label = { Text("Quantidade em Estoque") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = costStr, onValueChange = { costStr = it }, label = { Text("Preço de Custo (R$)") }, modifier = Modifier.fillMaxWidth())
                    OutlinedTextField(value = sellStr, onValueChange = { sellStr = it }, label = { Text("Preço de Venda (R$)") }, modifier = Modifier.fillMaxWidth())
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val qty = qtyStr.toIntOrNull() ?: 1
                        val cost = costStr.replace(",", ".").toDoubleOrNull() ?: 0.0
                        val sell = sellStr.replace(",", ".").toDoubleOrNull() ?: 0.0
                        if (name.isNotBlank()) {
                            onAddProduct(name, brand, category, qty, 3, cost, sell)
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
