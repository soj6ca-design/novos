package com.example.vaniravanessa.model

enum class AppointmentStatus(val label: String) {
    CONFIRMADO("Confirmado"),
    AGUARDANDO("Aguardando"),
    CONCLUIDO("Concluído"),
    CANCELADO("Cancelado"),
    BLOQUEIO("Bloqueio")
}

enum class PaymentMethod(val label: String) {
    PIX("PIX"),
    CARTAO_CREDITO("Cartão de Crédito"),
    CARTAO_DEBITO("Cartão de Débito"),
    DINHEIRO("Dinheiro"),
    PENDENTE("A Combinar")
}

enum class PaymentStatus(val label: String) {
    PAGO("Pago"),
    PENDENTE("Pendente")
}

enum class AppMode {
    ADMIN,
    CLIENT_PORTAL
}

enum class AdminTab(val title: String) {
    DASHBOARD("Início"),
    AGENDA("Agenda"),
    CLIENTES("Clientes"),
    SERVICOS("Serviços"),
    FINANCEIRO("Financeiro"),
    ESTOQUE("Estoque"),
    PROFISSIONAIS("Equipe"),
    IA_ASSISTENTE("IA Consultora")
}

enum class ClientPortalTab(val title: String) {
    AGENDAR("Novo Horário"),
    MEUS_AGENDAMENTOS("Meus Horários"),
    CONSULTORA_IA("Dicas & IA"),
    COMPARTILHAR("Compartilhar")
}

data class Professional(
    val id: Long,
    val name: String,
    val role: String,
    val avatarEmoji: String,
    val phone: String,
    val active: Boolean = true,
    val rating: Double = 5.0,
    val serviceIdsCsv: String = "all"
)

data class SalonService(
    val id: Long,
    val name: String,
    val category: String,
    val price: Double,
    val durationMinutes: Int,
    val description: String,
    val iconName: String,
    val professionalIdsCsv: String = "all"
)

data class Client(
    val id: Long,
    val name: String,
    val phone: String,
    val birthDate: String = "",
    val address: String = "",
    val hairPreferences: String = "",
    val notes: String = "",
    val token: String = "",
    val registeredAt: Long = System.currentTimeMillis(),
    val lastVisitTimestamp: Long = System.currentTimeMillis()
)

data class Appointment(
    val id: Long,
    val clientName: String,
    val clientPhone: String,
    val clientId: Long? = null,
    val serviceId: Long,
    val serviceName: String,
    val professionalId: Long,
    val professionalName: String,
    val dateStr: String, // YYYY-MM-DD
    val timeStr: String, // HH:mm
    val durationMinutes: Int,
    val price: Double,
    val status: AppointmentStatus = AppointmentStatus.CONFIRMADO,
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

data class PaymentTransaction(
    val id: Long,
    val appointmentId: Long? = null,
    val clientName: String,
    val serviceName: String,
    val amount: Double,
    val dateStr: String,
    val paymentMethod: PaymentMethod = PaymentMethod.PIX,
    val status: PaymentStatus = PaymentStatus.PAGO,
    val dueDate: String? = null,
    val paidAt: Long? = null,
    val notes: String? = null
)

data class Product(
    val id: Long,
    val name: String,
    val brand: String,
    val category: String,
    val quantityInStock: Int,
    val minStockAlert: Int = 3,
    val costPrice: Double,
    val sellPrice: Double,
    val barcode: String = "",
    val description: String = ""
)

data class ScheduleBlock(
    val id: Long,
    val professionalId: Long,
    val dateStr: String,
    val startTime: String,
    val endTime: String,
    val reason: String
)

data class ChatMessage(
    val id: String,
    val sender: String, // "user" or "ai"
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)
