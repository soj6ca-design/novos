package com.example.vaniravanessa.viewmodel

import android.app.Application
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.CalendarContract
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.vaniravanessa.data.SalonSeedData
import com.example.vaniravanessa.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class SalonViewModel(application: Application) : AndroidViewModel(application) {

    private val _salonName = MutableStateFlow("Vanira e Vanessa")
    val salonName: StateFlow<String> = _salonName.asStateFlow()

    private val _appMode = MutableStateFlow(AppMode.ADMIN)
    val appMode: StateFlow<AppMode> = _appMode.asStateFlow()

    private val _currentAdminTab = MutableStateFlow(AdminTab.DASHBOARD)
    val currentAdminTab: StateFlow<AdminTab> = _currentAdminTab.asStateFlow()

    private val _currentClientPortalTab = MutableStateFlow(ClientPortalTab.AGENDAR)
    val currentClientPortalTab: StateFlow<ClientPortalTab> = _currentClientPortalTab.asStateFlow()

    private val _adminPin = MutableStateFlow("1234")
    val adminPin: StateFlow<String> = _adminPin.asStateFlow()

    private val _isDarkMode = MutableStateFlow(false)
    val isDarkMode: StateFlow<Boolean> = _isDarkMode.asStateFlow()

    private val _selectedAgendaDate = MutableStateFlow(SalonSeedData.getTodayDateStr())
    val selectedAgendaDate: StateFlow<String> = _selectedAgendaDate.asStateFlow()

    private val _selectedProfessionalFilter = MutableStateFlow<Long?>(null)
    val selectedProfessionalFilter: StateFlow<Long?> = _selectedProfessionalFilter.asStateFlow()

    private val _clientSearchQuery = MutableStateFlow("")
    val clientSearchQuery: StateFlow<String> = _clientSearchQuery.asStateFlow()

    private val _activeClientForPortal = MutableStateFlow<Client?>(null)
    val activeClientForPortal: StateFlow<Client?> = _activeClientForPortal.asStateFlow()

    // Data lists
    private val _professionals = MutableStateFlow(SalonSeedData.INITIAL_PROFESSIONALS)
    val professionals: StateFlow<List<Professional>> = _professionals.asStateFlow()

    private val _services = MutableStateFlow(SalonSeedData.INITIAL_SERVICES)
    val services: StateFlow<List<SalonService>> = _services.asStateFlow()

    private val _clients = MutableStateFlow(SalonSeedData.getInitialClients())
    val clients: StateFlow<List<Client>> = _clients.asStateFlow()

    private val _appointments = MutableStateFlow(SalonSeedData.getInitialAppointments())
    val appointments: StateFlow<List<Appointment>> = _appointments.asStateFlow()

    private val _transactions = MutableStateFlow(SalonSeedData.getInitialTransactions())
    val transactions: StateFlow<List<PaymentTransaction>> = _transactions.asStateFlow()

    private val _products = MutableStateFlow(SalonSeedData.INITIAL_PRODUCTS)
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    private val _scheduleBlocks = MutableStateFlow(SalonSeedData.getInitialScheduleBlocks())
    val scheduleBlocks: StateFlow<List<ScheduleBlock>> = _scheduleBlocks.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                id = "init_1",
                sender = "ai",
                text = "Olá! Sou a assistente executiva inteligente do Vanira e Vanessa. Como posso ajudar com a gestão de agenda, faturamento ou clientes hoje?",
                timestamp = System.currentTimeMillis()
            )
        )
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isAiLoading = MutableStateFlow(false)
    val isAiLoading: StateFlow<Boolean> = _isAiLoading.asStateFlow()

    fun updateSalonName(name: String) {
        _salonName.value = name
    }

    fun switchMode(mode: AppMode) {
        _appMode.value = mode
    }

    fun selectAdminTab(tab: AdminTab) {
        _currentAdminTab.value = tab
    }

    fun selectClientPortalTab(tab: ClientPortalTab) {
        _currentClientPortalTab.value = tab
    }

    fun toggleDarkMode() {
        _isDarkMode.value = !_isDarkMode.value
    }

    fun setAgendaDate(dateStr: String) {
        _selectedAgendaDate.value = dateStr
    }

    fun setProfessionalFilter(profId: Long?) {
        _selectedProfessionalFilter.value = profId
    }

    fun setClientSearchQuery(query: String) {
        _clientSearchQuery.value = query
    }

    fun setActiveClientForPortal(client: Client?) {
        _activeClientForPortal.value = client
    }

    fun verifyAdminPin(pin: String): Boolean {
        return pin.trim() == _adminPin.value.trim()
    }

    fun setAdminPin(newPin: String) {
        _adminPin.value = newPin
    }

    // Conflict detection
    fun isTimeSlotOccupied(professionalId: Long, dateStr: String, timeStr: String, excludeAppId: Long? = null): Boolean {
        val hasAppointment = _appointments.value.any {
            it.id != excludeAppId &&
            it.professionalId == professionalId &&
            it.dateStr == dateStr &&
            it.timeStr == timeStr &&
            it.status != AppointmentStatus.CANCELADO
        }
        val hasBlock = _scheduleBlocks.value.any {
            it.professionalId == professionalId &&
            it.dateStr == dateStr &&
            timeStr >= it.startTime && timeStr < it.endTime
        }
        return hasAppointment || hasBlock
    }

    fun getOccupiedTimes(professionalId: Long, dateStr: String, excludeAppId: Long? = null): Set<String> {
        val occupied = mutableSetOf<String>()
        _appointments.value.filter {
            it.id != excludeAppId &&
            it.professionalId == professionalId &&
            it.dateStr == dateStr &&
            it.status != AppointmentStatus.CANCELADO
        }.forEach { occupied.add(it.timeStr) }
        return occupied
    }

    // Appointment CRUD
    fun addAppointment(
        clientName: String,
        clientPhone: String,
        clientId: Long?,
        service: SalonService,
        professional: Professional,
        dateStr: String,
        timeStr: String,
        notes: String = ""
    ): Boolean {
        if (isTimeSlotOccupied(professional.id, dateStr, timeStr)) {
            return false
        }
        val newId = (_appointments.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val newApp = Appointment(
            id = newId,
            clientName = clientName,
            clientPhone = clientPhone,
            clientId = clientId,
            serviceId = service.id,
            serviceName = service.name,
            professionalId = professional.id,
            professionalName = professional.name,
            dateStr = dateStr,
            timeStr = timeStr,
            durationMinutes = service.durationMinutes,
            price = service.price,
            status = AppointmentStatus.CONFIRMADO,
            notes = notes,
            createdAt = System.currentTimeMillis()
        )
        _appointments.value = _appointments.value + newApp

        // Also add pending payment transaction
        val newTxId = (_transactions.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val newTx = PaymentTransaction(
            id = newTxId,
            appointmentId = newId,
            clientName = clientName,
            serviceName = service.name,
            amount = service.price,
            dateStr = dateStr,
            paymentMethod = PaymentMethod.PENDENTE,
            status = PaymentStatus.PENDENTE,
            dueDate = dateStr
        )
        _transactions.value = _transactions.value + newTx
        return true
    }

    fun updateAppointmentStatus(id: Long, status: AppointmentStatus) {
        _appointments.value = _appointments.value.map {
            if (it.id == id) it.copy(status = status) else it
        }
        if (status == AppointmentStatus.CONCLUIDO) {
            _transactions.value = _transactions.value.map {
                if (it.appointmentId == id && it.status == PaymentStatus.PENDENTE) {
                    it.copy(status = PaymentStatus.PAGO, paidAt = System.currentTimeMillis())
                } else it
            }
        }
    }

    fun rescheduleAppointment(id: Long, newDate: String, newTime: String): Boolean {
        val target = _appointments.value.find { it.id == id } ?: return false
        if (isTimeSlotOccupied(target.professionalId, newDate, newTime, excludeAppId = id)) {
            return false
        }
        _appointments.value = _appointments.value.map {
            if (it.id == id) it.copy(dateStr = newDate, timeStr = newTime, status = AppointmentStatus.CONFIRMADO) else it
        }
        return true
    }

    fun deleteAppointment(id: Long) {
        _appointments.value = _appointments.value.filterNot { it.id == id }
    }

    // Client CRUD
    fun addClient(name: String, phone: String, birthDate: String, address: String, hairPref: String, notes: String) {
        val newId = (_clients.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val cleanPhone = phone.replace(Regex("[^0-9]"), "")
        val newClient = Client(
            id = newId,
            name = name,
            phone = cleanPhone,
            birthDate = birthDate,
            address = address,
            hairPreferences = hairPref,
            notes = notes,
            token = "cli_$cleanPhone",
            registeredAt = System.currentTimeMillis(),
            lastVisitTimestamp = System.currentTimeMillis()
        )
        _clients.value = _clients.value + newClient
    }

    fun updateClient(client: Client) {
        _clients.value = _clients.value.map { if (it.id == client.id) client else it }
    }

    fun deleteClient(id: Long) {
        _clients.value = _clients.value.filterNot { it.id == id }
    }

    // Services CRUD
    fun addService(name: String, category: String, price: Double, duration: Int, desc: String, profIdsCsv: String = "all") {
        val newId = (_services.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val s = SalonService(
            id = newId,
            name = name,
            category = category,
            price = price,
            durationMinutes = duration,
            description = desc,
            iconName = "content_cut",
            professionalIdsCsv = profIdsCsv
        )
        _services.value = _services.value + s
    }

    fun updateService(service: SalonService) {
        _services.value = _services.value.map { if (it.id == service.id) service else it }
    }

    fun deleteService(id: Long) {
        _services.value = _services.value.filterNot { it.id == id }
    }

    // Professionals CRUD
    fun addProfessional(name: String, role: String, phone: String, emoji: String) {
        val newId = (_professionals.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val p = Professional(
            id = newId,
            name = name,
            role = role,
            avatarEmoji = if (emoji.isNotBlank()) emoji else "💇‍♀️",
            phone = phone,
            active = true,
            rating = 5.0
        )
        _professionals.value = _professionals.value + p
    }

    fun updateProfessional(prof: Professional) {
        _professionals.value = _professionals.value.map { if (it.id == prof.id) prof else it }
    }

    // Transactions
    fun markTransactionPaid(id: Long, method: PaymentMethod) {
        _transactions.value = _transactions.value.map {
            if (it.id == id) {
                it.copy(
                    paymentMethod = method,
                    status = PaymentStatus.PAGO,
                    paidAt = System.currentTimeMillis()
                )
            } else it
        }
    }

    fun addCustomTransaction(clientName: String, serviceName: String, amount: Double, method: PaymentMethod, status: PaymentStatus, dueDate: String?) {
        val newId = (_transactions.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val tx = PaymentTransaction(
            id = newId,
            clientName = clientName,
            serviceName = serviceName,
            amount = amount,
            dateStr = SalonSeedData.getTodayDateStr(),
            paymentMethod = method,
            status = status,
            dueDate = dueDate,
            paidAt = if (status == PaymentStatus.PAGO) System.currentTimeMillis() else null
        )
        _transactions.value = _transactions.value + tx
    }

    // Inventory
    fun adjustProductStock(id: Long, delta: Int) {
        _products.value = _products.value.map {
            if (it.id == id) {
                val newQ = (it.quantityInStock + delta).coerceAtLeast(0)
                it.copy(quantityInStock = newQ)
            } else it
        }
    }

    fun addProduct(name: String, brand: String, category: String, qty: Int, minStock: Int, cost: Double, sell: Double) {
        val newId = (_products.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val p = Product(
            id = newId,
            name = name,
            brand = brand,
            category = category,
            quantityInStock = qty,
            minStockAlert = minStock,
            costPrice = cost,
            sellPrice = sell
        )
        _products.value = _products.value + p
    }

    // Schedule Blocks
    fun addScheduleBlock(profId: Long, dateStr: String, start: String, end: String, reason: String) {
        val newId = (_scheduleBlocks.value.maxOfOrNull { it.id } ?: 0L) + 1L
        val b = ScheduleBlock(newId, profId, dateStr, start, end, reason)
        _scheduleBlocks.value = _scheduleBlocks.value + b
    }

    fun deleteScheduleBlock(id: Long) {
        _scheduleBlocks.value = _scheduleBlocks.value.filterNot { it.id == id }
    }

    // Reset Data
    fun resetDataToInitial() {
        _professionals.value = SalonSeedData.INITIAL_PROFESSIONALS
        _services.value = SalonSeedData.INITIAL_SERVICES
        _clients.value = SalonSeedData.getInitialClients()
        _appointments.value = SalonSeedData.getInitialAppointments()
        _transactions.value = SalonSeedData.getInitialTransactions()
        _products.value = SalonSeedData.INITIAL_PRODUCTS
        _scheduleBlocks.value = SalonSeedData.getInitialScheduleBlocks()
    }

    // AI Consultant prompt
    fun sendAiPrompt(promptText: String) {
        if (promptText.isBlank()) return
        val userMsg = ChatMessage(UUID.randomUUID().toString(), "user", promptText)
        _chatMessages.value = _chatMessages.value + userMsg
        _isAiLoading.value = true

        viewModelScope.launch {
            val responseText = analyzeLocally(promptText)
            val aiMsg = ChatMessage(UUID.randomUUID().toString(), "ai", responseText)
            _chatMessages.value = _chatMessages.value + aiMsg
            _isAiLoading.value = false
        }
    }

    private fun analyzeLocally(query: String): String {
        val q = query.lowercase(Locale.getDefault())
        val formatBRL = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
        val currentName = _salonName.value

        if (q.contains("fatur") || q.contains("ganh") || q.contains("quanto recebi") || q.contains("ticket")) {
            val paid = _transactions.value.filter { it.status == PaymentStatus.PAGO }
            val totalRev = paid.sumOf { it.amount }
            val avgTicket = if (paid.isNotEmpty()) totalRev / paid.size else 0.0
            val pending = _transactions.value.filter { it.status == PaymentStatus.PENDENTE }.sumOf { it.amount }
            return "✨ **Relatório Financeiro do $currentName**\n\n" +
                   "• **Faturamento total pago:** ${formatBRL.format(totalRev)}\n" +
                   "• **Atendimentos registrados:** ${_appointments.value.size}\n" +
                   "• **Ticket médio por atendimento:** ${formatBRL.format(avgTicket)}\n\n" +
                   "💡 **Dica:** Você possui ${formatBRL.format(pending)} em valores pendentes a receber."
        }

        if (q.contains("60 dias") || q.contains("inativ") || q.contains("sem voltar") || q.contains("sumid")) {
            val now = System.currentTimeMillis()
            val sixtyDays = 60L * 24 * 60 * 60 * 1000
            val inactive = _clients.value.filter { (now - it.lastVisitTimestamp) >= sixtyDays }
            if (inactive.isEmpty()) {
                return "🎉 Parabéns! Todos os clientes visitaram o $currentName recentemente."
            }
            val listStr = inactive.joinToString("\n") { c ->
                val days = ((now - c.lastVisitTimestamp) / (1000 * 60 * 60 * 24)).toInt()
                "• **${c.name}** (WhatsApp: ${c.phone}) - Ausente há $days dias (${c.hairPreferences})"
            }
            return "📋 **Clientes há mais de 60 dias sem voltar:**\n\n$listStr\n\n" +
                   "💬 **Sugestão de WhatsApp:**\n" +
                   "\"Olá {Nome}! Sentimos sua falta no $currentName. Que tal renovar seus fios com um mimo especial esta semana?\""
        }

        if (q.contains("receber") || q.contains("pendente") || q.contains("divida")) {
            val pendingList = _transactions.value.filter { it.status == PaymentStatus.PENDENTE }
            val totalPending = pendingList.sumOf { it.amount }
            val items = pendingList.joinToString("\n") { "• **${it.clientName}** — ${formatBRL.format(it.amount)} (${it.serviceName})" }
            return "💳 **Contas a Receber / Pendentes:**\n\n" +
                   "Total a receber: **${formatBRL.format(totalPending)}** em ${pendingList.size} lançamentos.\n\n" +
                   "$items\n\n" +
                   "📲 Você pode enviar um lembrete PIX via WhatsApp com um toque!"
        }

        if (q.contains("colora") || q.contains("mecha") || q.contains("loiro") || q.contains("ruiv")) {
            val colorList = _clients.value.filter {
                val p = it.hairPreferences.lowercase(Locale.getDefault())
                p.contains("color") || p.contains("mecha") || p.contains("loiro") || p.contains("ruiv")
            }
            val items = colorList.joinToString("\n") { "• **${it.name}**: ${it.hairPreferences} (Tel: ${it.phone})" }
            return "🎨 **Clientes com histórico de Coloração & Mechas:**\n\n" +
                   "Encontramos ${colorList.size} clientes com essa preferência:\n\n$items\n\n" +
                   "💇‍♀️ Mechas e colorações exigem retoque a cada 30-45 dias. Ótimo momento para contato!"
        }

        if (q.contains("whatsapp") || q.contains("mensagem") || q.contains("modelo")) {
            return "📲 **Modelos Prontos de WhatsApp para o $currentName:**\n\n" +
                   "1️⃣ **Lembrete de Véspera:**\n" +
                   "\"Olá, [Nome]! 💇‍♀️ Passando para lembrar do seu horário no $currentName amanhã às [Horário]. Confirma presença? Te esperamos!\"\n\n" +
                   "2️⃣ **Mensagem de Retorno (60+ dias):**\n" +
                   "\"Oi, [Nome]! Já faz um tempinho desde sua última visita ao $currentName. Seus cabelos merecem aquele carinho! Vamos agendar?\"\n\n" +
                   "3️⃣ **Pós-Atendimento:**\n" +
                   "\"Oi [Nome]! Amamos cuidar de você hoje no $currentName. Qualquer dúvida sobre os cuidados em casa estamos por aqui!\""
        }

        val totalPaid = _transactions.value.filter { it.status == PaymentStatus.PAGO }.sumOf { it.amount }
        val totalPending = _transactions.value.filter { it.status == PaymentStatus.PENDENTE }.sumOf { it.amount }
        return "Olá! Sou a assistente estratégica do **$currentName**.\n\n" +
               "• **Clientes cadastrados:** ${_clients.value.size}\n" +
               "• **Atendimentos no sistema:** ${_appointments.value.size}\n" +
               "• **Total recebido:** ${formatBRL.format(totalPaid)}\n" +
               "• **Contas a receber:** ${formatBRL.format(totalPending)}\n\n" +
               "Pergunte-me sobre faturamento, clientes inativos há 60 dias, contas a receber ou modelos de mensagens!"
    }

    // Intents
    fun openWhatsApp(context: Context, phone: String, message: String) {
        val cleanPhone = phone.replace(Regex("[^0-9]"), "")
        val formattedPhone = if (cleanPhone.startsWith("55")) cleanPhone else "55$cleanPhone"
        val url = "https://api.whatsapp.com/send?phone=$formattedPhone&text=${Uri.encode(message)}"
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(intent)
        } catch (_: Exception) {}
    }

    fun addToGoogleCalendar(context: Context, appointment: Appointment) {
        try {
            val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())
            val date = sdf.parse("${appointment.dateStr} ${appointment.timeStr}") ?: Date()
            val startMillis = date.time
            val endMillis = startMillis + appointment.durationMinutes * 60 * 1000

            val intent = Intent(Intent.ACTION_INSERT)
                .setData(CalendarContract.Events.CONTENT_URI)
                .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, startMillis)
                .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endMillis)
                .putExtra(CalendarContract.Events.TITLE, "${appointment.serviceName} - ${_salonName.value}")
                .putExtra(CalendarContract.Events.DESCRIPTION, "Cliente: ${appointment.clientName}\nProfissional: ${appointment.professionalName}\nValor: R$ ${appointment.price}")
                .putExtra(CalendarContract.Events.EVENT_LOCATION, _salonName.value)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        } catch (_: Exception) {}
    }

    fun getClientPortalShareText(client: Client?): String {
        val clientGreeting = if (client != null) "Olá ${client.name}!" else "Olá!"
        return "$clientGreeting Agende seu horário no salão ${_salonName.value} com Vanira e Vanessa e escolha seu serviço e horário preferido diretamente pelo nosso aplicativo!"
    }
}
