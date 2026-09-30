package com.example.vaniravanessa

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.vaniravanessa.model.*
import com.example.vaniravanessa.ui.components.*
import com.example.vaniravanessa.ui.screens.*
import com.example.vaniravanessa.ui.theme.BellaWinePrimary
import com.example.vaniravanessa.ui.theme.VaniraEVanessaTheme
import com.example.vaniravanessa.viewmodel.SalonViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val viewModel: SalonViewModel = viewModel()
            val isDarkMode by viewModel.isDarkMode.collectAsStateWithLifecycle()

            VaniraEVanessaTheme(darkTheme = isDarkMode) {
                SalonAppRoot(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun SalonAppRoot(viewModel: SalonViewModel) {
    val context = LocalContext.current
    val salonName by viewModel.salonName.collectAsStateWithLifecycle()
    val appMode by viewModel.appMode.collectAsStateWithLifecycle()
    val currentAdminTab by viewModel.currentAdminTab.collectAsStateWithLifecycle()
    val currentClientPortalTab by viewModel.currentClientPortalTab.collectAsStateWithLifecycle()
    val isDarkMode by viewModel.isDarkMode.collectAsStateWithLifecycle()
    val selectedDate by viewModel.selectedAgendaDate.collectAsStateWithLifecycle()
    val selectedProfFilter by viewModel.selectedProfessionalFilter.collectAsStateWithLifecycle()
    val clientSearchQuery by viewModel.clientSearchQuery.collectAsStateWithLifecycle()

    val professionals by viewModel.professionals.collectAsStateWithLifecycle()
    val services by viewModel.services.collectAsStateWithLifecycle()
    val clients by viewModel.clients.collectAsStateWithLifecycle()
    val appointments by viewModel.appointments.collectAsStateWithLifecycle()
    val transactions by viewModel.transactions.collectAsStateWithLifecycle()
    val products by viewModel.products.collectAsStateWithLifecycle()
    val blocks by viewModel.scheduleBlocks.collectAsStateWithLifecycle()
    val chatMessages by viewModel.chatMessages.collectAsStateWithLifecycle()
    val isAiLoading by viewModel.isAiLoading.collectAsStateWithLifecycle()

    // Modals
    var showNewAppointmentDialog by remember { mutableStateOf(false) }
    var showNewClientDialog by remember { mutableStateOf(false) }
    var clientToEdit by remember { mutableStateOf<Client?>(null) }
    var showAdminPinDialog by remember { mutableStateOf(false) }
    var showEditSalonNameDialog by remember { mutableStateOf(false) }
    var showBackupDialog by remember { mutableStateOf(false) }
    var showMoreMenuSheet by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            SalonTopBar(
                salonName = salonName,
                appMode = appMode,
                isDarkMode = isDarkMode,
                onToggleDarkMode = { viewModel.toggleDarkMode() },
                onSwitchToClientMode = { viewModel.switchMode(AppMode.CLIENT_PORTAL) },
                onRequestExitClientMode = { showAdminPinDialog = true },
                onOpenBackup = { showBackupDialog = true },
                onEditSalonName = { showEditSalonNameDialog = true }
            )
        },
        bottomBar = {
            if (appMode == AppMode.ADMIN) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.onSurface
                ) {
                    NavigationBarItem(
                        selected = currentAdminTab == AdminTab.DASHBOARD,
                        onClick = { viewModel.selectAdminTab(AdminTab.DASHBOARD) },
                        icon = { Icon(Icons.Default.Home, contentDescription = "Início") },
                        label = { Text("Início") }
                    )
                    NavigationBarItem(
                        selected = currentAdminTab == AdminTab.AGENDA,
                        onClick = { viewModel.selectAdminTab(AdminTab.AGENDA) },
                        icon = { Icon(Icons.Default.CalendarMonth, contentDescription = "Agenda") },
                        label = { Text("Agenda") }
                    )
                    NavigationBarItem(
                        selected = currentAdminTab == AdminTab.CLIENTES,
                        onClick = { viewModel.selectAdminTab(AdminTab.CLIENTES) },
                        icon = { Icon(Icons.Default.People, contentDescription = "Clientes") },
                        label = { Text("Clientes") }
                    )
                    NavigationBarItem(
                        selected = currentAdminTab == AdminTab.FINANCEIRO,
                        onClick = { viewModel.selectAdminTab(AdminTab.FINANCEIRO) },
                        icon = { Icon(Icons.Default.AttachMoney, contentDescription = "Financeiro") },
                        label = { Text("Financeiro") }
                    )
                    NavigationBarItem(
                        selected = currentAdminTab in listOf(AdminTab.SERVICOS, AdminTab.ESTOQUE, AdminTab.PROFISSIONAIS, AdminTab.IA_ASSISTENTE),
                        onClick = { showMoreMenuSheet = true },
                        icon = { Icon(Icons.Default.Menu, contentDescription = "Mais") },
                        label = { Text("Mais") }
                    )
                }
            } else {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.onSurface
                ) {
                    NavigationBarItem(
                        selected = currentClientPortalTab == ClientPortalTab.AGENDAR,
                        onClick = { viewModel.selectClientPortalTab(ClientPortalTab.AGENDAR) },
                        icon = { Icon(Icons.Default.AddCircleOutline, contentDescription = "Agendar") },
                        label = { Text("Agendar") }
                    )
                    NavigationBarItem(
                        selected = currentClientPortalTab == ClientPortalTab.MEUS_AGENDAMENTOS,
                        onClick = { viewModel.selectClientPortalTab(ClientPortalTab.MEUS_AGENDAMENTOS) },
                        icon = { Icon(Icons.Default.Schedule, contentDescription = "Meus Horários") },
                        label = { Text("Horários") }
                    )
                    NavigationBarItem(
                        selected = currentClientPortalTab == ClientPortalTab.CONSULTORA_IA,
                        onClick = { viewModel.selectClientPortalTab(ClientPortalTab.CONSULTORA_IA) },
                        icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "Dicas IA") },
                        label = { Text("Dicas IA") }
                    )
                    NavigationBarItem(
                        selected = currentClientPortalTab == ClientPortalTab.COMPARTILHAR,
                        onClick = { viewModel.selectClientPortalTab(ClientPortalTab.COMPARTILHAR) },
                        icon = { Icon(Icons.Default.Share, contentDescription = "Compartilhar") },
                        label = { Text("Indicar") }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (appMode == AppMode.CLIENT_PORTAL) {
                ClientPortalScreen(
                    salonName = salonName,
                    currentTab = currentClientPortalTab,
                    onSelectTab = { viewModel.selectClientPortalTab(it) },
                    services = services,
                    professionals = professionals,
                    appointments = appointments,
                    selectedDate = selectedDate,
                    onBookAppointment = { name, phone, s, p, d, t, notes ->
                        viewModel.addAppointment(name, phone, null, s, p, d, t, notes)
                    },
                    onCancelAppointment = { viewModel.updateAppointmentStatus(it, AppointmentStatus.CANCELADO) },
                    onWhatsAppClick = { phone, msg -> viewModel.openWhatsApp(context, phone, msg) },
                    onSharePortal = {
                        val shareText = viewModel.getClientPortalShareText(null)
                        viewModel.openWhatsApp(context, "", shareText)
                    }
                )
            } else {
                when (currentAdminTab) {
                    AdminTab.DASHBOARD -> {
                        DashboardScreen(
                            salonName = salonName,
                            selectedDate = selectedDate,
                            appointments = appointments,
                            transactions = transactions,
                            onSelectTab = { viewModel.selectAdminTab(it) },
                            onNewAppointmentClick = { showNewAppointmentDialog = true },
                            onNewClientClick = {
                                clientToEdit = null
                                showNewClientDialog = true
                            },
                            onNewServiceClick = { viewModel.selectAdminTab(AdminTab.SERVICOS) },
                            onStatusChange = { id, status -> viewModel.updateAppointmentStatus(id, status) },
                            onDeleteAppointment = { viewModel.deleteAppointment(it) },
                            onWhatsAppClick = { phone, msg -> viewModel.openWhatsApp(context, phone, msg) },
                            onAddToCalendar = { viewModel.addToGoogleCalendar(context, it) },
                            onOpenBackup = { showBackupDialog = true },
                            onSharePortal = {
                                val shareText = viewModel.getClientPortalShareText(null)
                                viewModel.openWhatsApp(context, "", shareText)
                            }
                        )
                    }
                    AdminTab.AGENDA -> {
                        ScheduleScreen(
                            salonName = salonName,
                            selectedDate = selectedDate,
                            onSelectDate = { viewModel.setAgendaDate(it) },
                            selectedProfFilter = selectedProfFilter,
                            onSelectProfFilter = { viewModel.setProfessionalFilter(it) },
                            professionals = professionals,
                            appointments = appointments,
                            blocks = blocks,
                            onNewAppointmentClick = { showNewAppointmentDialog = true },
                            onStatusChange = { id, status -> viewModel.updateAppointmentStatus(id, status) },
                            onDeleteAppointment = { viewModel.deleteAppointment(it) },
                            onWhatsAppClick = { phone, msg -> viewModel.openWhatsApp(context, phone, msg) },
                            onAddToCalendar = { viewModel.addToGoogleCalendar(context, it) }
                        )
                    }
                    AdminTab.CLIENTES -> {
                        ClientsScreen(
                            clients = clients,
                            searchQuery = clientSearchQuery,
                            onSearchChange = { viewModel.setClientSearchQuery(it) },
                            onNewClientClick = {
                                clientToEdit = null
                                showNewClientDialog = true
                            },
                            onEditClient = {
                                clientToEdit = it
                                showNewClientDialog = true
                            },
                            onDeleteClient = { viewModel.deleteClient(it) },
                            onWhatsAppClick = { phone, msg -> viewModel.openWhatsApp(context, phone, msg) },
                            onSharePortal = { client ->
                                val shareText = viewModel.getClientPortalShareText(client)
                                viewModel.openWhatsApp(context, client.phone, shareText)
                            },
                            salonName = salonName
                        )
                    }
                    AdminTab.SERVICOS -> {
                        ServicesScreen(
                            services = services,
                            onNewServiceClick = {
                                viewModel.addService("Novo Serviço", "Cabelo", 100.0, 45, "Descrição do serviço")
                            },
                            onDeleteService = { viewModel.deleteService(it) }
                        )
                    }
                    AdminTab.FINANCEIRO -> {
                        FinancialScreen(
                            transactions = transactions,
                            onMarkPaid = { id, method -> viewModel.markTransactionPaid(id, method) },
                            onAddTransaction = { c, s, a, m, st, d -> viewModel.addCustomTransaction(c, s, a, m, st, d) }
                        )
                    }
                    AdminTab.ESTOQUE -> {
                        InventoryScreen(
                            products = products,
                            onAdjustStock = { id, delta -> viewModel.adjustProductStock(id, delta) },
                            onAddProduct = { n, b, c, q, m, cost, sell -> viewModel.addProduct(n, b, c, q, m, cost, sell) }
                        )
                    }
                    AdminTab.PROFISSIONAIS -> {
                        ProfessionalsScreen(
                            professionals = professionals,
                            onAddProfessional = { n, r, p, e -> viewModel.addProfessional(n, r, p, e) },
                            onWhatsAppClick = { phone, msg -> viewModel.openWhatsApp(context, phone, msg) }
                        )
                    }
                    AdminTab.IA_ASSISTENTE -> {
                        AiAssistantScreen(
                            salonName = salonName,
                            messages = chatMessages,
                            isLoading = isAiLoading,
                            onSendMessage = { viewModel.sendAiPrompt(it) }
                        )
                    }
                }
            }
        }
    }

    // "Mais" Menu Bottom Sheet
    if (showMoreMenuSheet) {
        ModalBottomSheet(onDismissRequest = { showMoreMenuSheet = false }) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Outras Seções do Salão", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                ListItem(
                    headlineContent = { Text("Serviços & Catálogo", fontWeight = FontWeight.SemiBold) },
                    leadingContent = { Icon(Icons.Default.ContentCut, contentDescription = null, tint = BellaWinePrimary) },
                    modifier = Modifier.clickable {
                        viewModel.selectAdminTab(AdminTab.SERVICOS)
                        showMoreMenuSheet = false
                    }
                )
                ListItem(
                    headlineContent = { Text("Estoque & Cosméticos", fontWeight = FontWeight.SemiBold) },
                    leadingContent = { Icon(Icons.Default.Inventory2, contentDescription = null, tint = BellaWinePrimary) },
                    modifier = Modifier.clickable {
                        viewModel.selectAdminTab(AdminTab.ESTOQUE)
                        showMoreMenuSheet = false
                    }
                )
                ListItem(
                    headlineContent = { Text("Equipe de Profissionais", fontWeight = FontWeight.SemiBold) },
                    leadingContent = { Icon(Icons.Default.Badge, contentDescription = null, tint = BellaWinePrimary) },
                    modifier = Modifier.clickable {
                        viewModel.selectAdminTab(AdminTab.PROFISSIONAIS)
                        showMoreMenuSheet = false
                    }
                )
                ListItem(
                    headlineContent = { Text("IA Consultora Executiva", fontWeight = FontWeight.SemiBold) },
                    leadingContent = { Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = BellaWinePrimary) },
                    modifier = Modifier.clickable {
                        viewModel.selectAdminTab(AdminTab.IA_ASSISTENTE)
                        showMoreMenuSheet = false
                    }
                )
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }

    // Dialogs
    if (showNewAppointmentDialog) {
        NewAppointmentDialog(
            services = services,
            professionals = professionals,
            currentDate = selectedDate,
            onDismiss = { showNewAppointmentDialog = false },
            onConfirm = { name, phone, s, p, d, t, notes ->
                viewModel.addAppointment(name, phone, null, s, p, d, t, notes)
            }
        )
    }

    if (showNewClientDialog) {
        NewClientDialog(
            initialClient = clientToEdit,
            onDismiss = {
                showNewClientDialog = false
                clientToEdit = null
            },
            onSave = { name, phone, bdate, addr, hair, notes ->
                if (clientToEdit == null) {
                    viewModel.addClient(name, phone, bdate, addr, hair, notes)
                } else {
                    viewModel.updateClient(
                        clientToEdit!!.copy(
                            name = name,
                            phone = phone,
                            birthDate = bdate,
                            address = addr,
                            hairPreferences = hair,
                            notes = notes
                        )
                    )
                }
            }
        )
    }

    if (showAdminPinDialog) {
        AdminPinDialog(
            onDismiss = { showAdminPinDialog = false },
            onVerify = { viewModel.verifyAdminPin(it) },
            onSuccess = { viewModel.switchMode(AppMode.ADMIN) }
        )
    }

    if (showEditSalonNameDialog) {
        EditSalonNameDialog(
            currentName = salonName,
            onDismiss = { showEditSalonNameDialog = false },
            onSave = { viewModel.updateSalonName(it) }
        )
    }

    if (showBackupDialog) {
        BackupDialog(
            onDismiss = { showBackupDialog = false },
            onResetData = { viewModel.resetDataToInitial() }
        )
    }
}
