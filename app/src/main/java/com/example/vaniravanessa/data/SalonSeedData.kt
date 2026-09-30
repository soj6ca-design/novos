package com.example.vaniravanessa.data

import com.example.vaniravanessa.model.*
import java.text.SimpleDateFormat
import java.util.*

object SalonSeedData {
    private val dayMillis = 86_400_000L

    fun getTodayDateStr(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return sdf.format(Date())
    }

    val INITIAL_PROFESSIONALS = listOf(
        Professional(
            id = 1L,
            name = "Vanira",
            role = "Cabeleireira & Visagista Master",
            avatarEmoji = "💇‍♀️",
            phone = "(11) 98111-2233",
            rating = 5.0,
            active = true,
            serviceIdsCsv = "1,2,3,5,6"
        ),
        Professional(
            id = 2L,
            name = "Vanessa",
            role = "Colorista & Terapeuta Capilar",
            avatarEmoji = "✨",
            phone = "(11) 98111-4455",
            rating = 5.0,
            active = true,
            serviceIdsCsv = "1,2,3,4,6,7"
        ),
        Professional(
            id = 3L,
            name = "Juliana Silva",
            role = "Designer de Unhas & Manicure",
            avatarEmoji = "💅",
            phone = "(11) 98222-3344",
            rating = 4.9,
            active = true,
            serviceIdsCsv = "8,9"
        ),
        Professional(
            id = 4L,
            name = "Beatriz Rocha",
            role = "Penteados & Tratamentos",
            avatarEmoji = "💆‍♀️",
            phone = "(11) 98333-4455",
            rating = 4.8,
            active = true,
            serviceIdsCsv = "1,2,6,7"
        )
    )

    val INITIAL_SERVICES = listOf(
        SalonService(
            id = 1L,
            name = "Corte Feminino & Escova",
            category = "Cabelo",
            price = 85.0,
            durationMinutes = 45,
            description = "Lavagem relaxante, corte visagista personalizado e finalização com escova modelada.",
            iconName = "content_cut",
            professionalIdsCsv = "1,3"
        ),
        SalonService(
            id = 2L,
            name = "Escova Modelada",
            category = "Cabelo",
            price = 60.0,
            durationMinutes = 40,
            description = "Lavagem com linha profissional e escovação com brilho acetinado e durabilidade.",
            iconName = "air",
            professionalIdsCsv = "1,3"
        ),
        SalonService(
            id = 3L,
            name = "Mechas & Loiro Iluminado",
            category = "Química & Cor",
            price = 290.0,
            durationMinutes = 150,
            description = "Técnica de morena iluminada ou loiro dos sonhos com plex protetor e matização.",
            iconName = "auto_awesome",
            professionalIdsCsv = "1"
        ),
        SalonService(
            id = 4L,
            name = "Coloração Completa",
            category = "Química & Cor",
            price = 180.0,
            durationMinutes = 90,
            description = "Cobertura de brancos ou mudança de tom com tintura premium e tratamento pós-cor.",
            iconName = "palette",
            professionalIdsCsv = "1"
        ),
        SalonService(
            id = 5L,
            name = "Progressiva Orgânica",
            category = "Química & Cor",
            price = 230.0,
            durationMinutes = 120,
            description = "Alisamento seguro sem formol, livre de cheiro forte, fios alinhados e sedosos.",
            iconName = "straighten",
            professionalIdsCsv = "1"
        ),
        SalonService(
            id = 6L,
            name = "Hidratação & Cronograma",
            category = "Tratamentos",
            price = 110.0,
            durationMinutes = 50,
            description = "Reposição de água, lipídios e aminoácidos para recuperação instantânea da fibra.",
            iconName = "spa",
            professionalIdsCsv = "1,3"
        ),
        SalonService(
            id = 7L,
            name = "Penteado para Festas",
            category = "Cabelo",
            price = 150.0,
            durationMinutes = 60,
            description = "Coques despojados, semipresos, tranças e finalização para formaturas e casamentos.",
            iconName = "face",
            professionalIdsCsv = "3"
        ),
        SalonService(
            id = 8L,
            name = "Manicure Tradicional",
            category = "Unhas",
            price = 35.0,
            durationMinutes = 40,
            description = "Cutilagem suave, esfoliação e esmaltação com acabamento impecável.",
            iconName = "brush",
            professionalIdsCsv = "2"
        ),
        SalonService(
            id = 9L,
            name = "Pedicure & Spa dos Pés",
            category = "Unhas",
            price = 55.0,
            durationMinutes = 45,
            description = "Imersão relaxante, hidratação profunda, esfoliação e esmaltação.",
            iconName = "clean_hands",
            professionalIdsCsv = "2"
        )
    )

    fun getInitialClients(): List<Client> {
        val now = System.currentTimeMillis()
        return listOf(
            Client(
                id = 1L,
                name = "Ana Carolina Ramos",
                phone = "11987654321",
                birthDate = "14/05/1992",
                address = "Rua Augusta, 450 - SP",
                hairPreferences = "Ondulado 2B, mechas loiro mel com raiz esfumada, evita sulfatos fortes.",
                notes = "Adora café expresso com canela; prefere água morna no lavatório.",
                token = "cli_11987654321",
                registeredAt = now - 30 * dayMillis,
                lastVisitTimestamp = now
            ),
            Client(
                id = 2L,
                name = "Maria Eduarda Lima",
                phone = "11976543210",
                birthDate = "22/09/1988",
                address = "Av. Paulista, 1200 - SP",
                hairPreferences = "Liso 1A natural, pontas retas; adora esmaltes nude clássicos.",
                notes = "Muito pontual, prefere agendamentos na parte da manhã.",
                token = "cli_11976543210",
                registeredAt = now - 45 * dayMillis,
                lastVisitTimestamp = now
            ),
            Client(
                id = 3L,
                name = "Fernanda Souza",
                phone = "11998123456",
                birthDate = "03/11/1995",
                address = "Rua Oscar Freire, 890 - SP",
                hairPreferences = "Cacheado 3A com luzes pontuais, fios finos que exigem bastante nutrição.",
                notes = "Em processo de cronograma capilar; comprou óleo de argan na última visita.",
                token = "cli_11998123456",
                registeredAt = now - 60 * dayMillis,
                lastVisitTimestamp = now - 15 * dayMillis
            ),
            Client(
                id = 4L,
                name = "Juliana Vasconcelos",
                phone = "11981237788",
                birthDate = "30/01/1986",
                address = "Alameda Lorena, 210 - SP",
                hairPreferences = "Coloração Ruivo Acobreado 7.4 Majirel; couro cabeludo sensível.",
                notes = "Fazer teste de mecha antes de clarear; sempre agenda com a Carla.",
                token = "cli_11981237788",
                registeredAt = now - 90 * dayMillis,
                lastVisitTimestamp = now - 25 * dayMillis
            ),
            Client(
                id = 5L,
                name = "Camila Fagundes",
                phone = "11972348899",
                birthDate = "19/08/1999",
                address = "Rua Haddock Lobo, 600 - SP",
                hairPreferences = "Loiro pérola; reconstrução mensal com queratina hidrolisada.",
                notes = "Cliente assídua toda quinta-feira.",
                token = "cli_11972348899",
                registeredAt = now - 120 * dayMillis,
                lastVisitTimestamp = now - 68 * dayMillis
            ),
            Client(
                id = 6L,
                name = "Patrícia Alencar",
                phone = "11993451122",
                birthDate = "11/12/1979",
                address = "Rua Bela Cintra, 730 - SP",
                hairPreferences = "Curto moderno com nuca batida; grisalho natural elegante.",
                notes = "Gosta de corte a seco.",
                token = "cli_11993451122",
                registeredAt = now - 150 * dayMillis,
                lastVisitTimestamp = now - 75 * dayMillis
            ),
            Client(
                id = 7L,
                name = "Renata Silveira",
                phone = "11984562211",
                birthDate = "05/04/1990",
                address = "Rua Pamplona, 320 - SP",
                hairPreferences = "Cabelo longo volumoso, gosta de ondas largas estilo babyliss.",
                notes = "Sem restrições.",
                token = "cli_11984562211",
                registeredAt = now - 20 * dayMillis,
                lastVisitTimestamp = now
            ),
            Client(
                id = 8L,
                name = "Marcela Dias",
                phone = "11985673322",
                birthDate = "17/07/1994",
                address = "Rua da Consolação, 1500 - SP",
                hairPreferences = "Liso com mechas californianas douradas.",
                notes = "Costuma vir para eventos.",
                token = "cli_11985673322",
                registeredAt = now - 10 * dayMillis,
                lastVisitTimestamp = now
            )
        )
    }

    fun getInitialAppointments(): List<Appointment> {
        val today = getTodayDateStr()
        val now = System.currentTimeMillis()
        return listOf(
            Appointment(
                id = 1L,
                clientName = "Ana Carolina Ramos",
                clientPhone = "11987654321",
                clientId = 1L,
                serviceId = 1L,
                serviceName = "Corte Feminino & Escova",
                professionalId = 1L,
                professionalName = "Vanira",
                dateStr = today,
                timeStr = "09:00",
                durationMinutes = 45,
                price = 85.0,
                status = AppointmentStatus.CONFIRMADO,
                createdAt = now
            ),
            Appointment(
                id = 2L,
                clientName = "Maria Eduarda Lima",
                clientPhone = "11976543210",
                clientId = 2L,
                serviceId = 9L,
                serviceName = "Pedicure & Spa dos Pés",
                professionalId = 3L,
                professionalName = "Juliana Silva",
                dateStr = today,
                timeStr = "10:30",
                durationMinutes = 45,
                price = 55.0,
                status = AppointmentStatus.CONFIRMADO,
                createdAt = now
            ),
            Appointment(
                id = 3L,
                clientName = "Fernanda Souza",
                clientPhone = "11998123456",
                clientId = 3L,
                serviceId = 3L,
                serviceName = "Mechas & Loiro Iluminado",
                professionalId = 1L,
                professionalName = "Vanira",
                dateStr = today,
                timeStr = "13:00",
                durationMinutes = 150,
                price = 290.0,
                status = AppointmentStatus.CONFIRMADO,
                createdAt = now
            ),
            Appointment(
                id = 4L,
                clientName = "Camila Fagundes",
                clientPhone = "11972348899",
                clientId = 5L,
                serviceId = 8L,
                serviceName = "Manicure Tradicional",
                professionalId = 3L,
                professionalName = "Juliana Silva",
                dateStr = today,
                timeStr = "14:00",
                durationMinutes = 40,
                price = 35.0,
                status = AppointmentStatus.AGUARDANDO,
                createdAt = now
            ),
            Appointment(
                id = 5L,
                clientName = "Juliana Vasconcelos",
                clientPhone = "11981237788",
                clientId = 4L,
                serviceId = 4L,
                serviceName = "Coloração Completa",
                professionalId = 2L,
                professionalName = "Vanessa",
                dateStr = today,
                timeStr = "15:30",
                durationMinutes = 90,
                price = 180.0,
                status = AppointmentStatus.CONFIRMADO,
                createdAt = now
            ),
            Appointment(
                id = 6L,
                clientName = "Patrícia Alencar",
                clientPhone = "11993451122",
                clientId = 6L,
                serviceId = 1L,
                serviceName = "Corte Feminino & Escova",
                professionalId = 4L,
                professionalName = "Beatriz Rocha",
                dateStr = today,
                timeStr = "16:30",
                durationMinutes = 45,
                price = 85.0,
                status = AppointmentStatus.AGUARDANDO,
                createdAt = now
            ),
            Appointment(
                id = 7L,
                clientName = "Renata Silveira",
                clientPhone = "11984562211",
                clientId = 7L,
                serviceId = 6L,
                serviceName = "Hidratação & Cronograma",
                professionalId = 4L,
                professionalName = "Beatriz Rocha",
                dateStr = today,
                timeStr = "17:30",
                durationMinutes = 50,
                price = 110.0,
                status = AppointmentStatus.CONFIRMADO,
                createdAt = now
            ),
            Appointment(
                id = 8L,
                clientName = "Marcela Dias",
                clientPhone = "11985673322",
                clientId = 8L,
                serviceId = 7L,
                serviceName = "Penteado para Festas",
                professionalId = 4L,
                professionalName = "Beatriz Rocha",
                dateStr = today,
                timeStr = "18:30",
                durationMinutes = 60,
                price = 150.0,
                status = AppointmentStatus.CANCELADO,
                createdAt = now
            )
        )
    }

    fun getInitialTransactions(): List<PaymentTransaction> {
        val today = getTodayDateStr()
        val now = System.currentTimeMillis()
        return listOf(
            PaymentTransaction(
                id = 1L,
                clientName = "Ana Carolina Ramos",
                serviceName = "Corte Feminino & Escova",
                amount = 85.0,
                dateStr = today,
                paymentMethod = PaymentMethod.PIX,
                status = PaymentStatus.PAGO,
                paidAt = now
            ),
            PaymentTransaction(
                id = 2L,
                clientName = "Maria Eduarda Lima",
                serviceName = "Pedicure & Spa dos Pés",
                amount = 55.0,
                dateStr = today,
                paymentMethod = PaymentMethod.CARTAO_DEBITO,
                status = PaymentStatus.PAGO,
                paidAt = now
            ),
            PaymentTransaction(
                id = 3L,
                clientName = "Juliana Vasconcelos",
                serviceName = "Coloração Completa",
                amount = 180.0,
                dateStr = today,
                paymentMethod = PaymentMethod.CARTAO_CREDITO,
                status = PaymentStatus.PAGO,
                paidAt = now
            ),
            PaymentTransaction(
                id = 4L,
                clientName = "Fernanda Souza",
                serviceName = "Mechas & Loiro Iluminado",
                amount = 290.0,
                dateStr = today,
                paymentMethod = PaymentMethod.PENDENTE,
                status = PaymentStatus.PENDENTE,
                dueDate = today,
                notes = "Aguardando confirmação de transferência PIX"
            ),
            PaymentTransaction(
                id = 5L,
                clientName = "Renata Silveira",
                serviceName = "Hidratação & Cronograma",
                amount = 110.0,
                dateStr = today,
                paymentMethod = PaymentMethod.PENDENTE,
                status = PaymentStatus.PENDENTE,
                dueDate = today,
                notes = "Pagamento na saída do salão"
            ),
            PaymentTransaction(
                id = 6L,
                clientName = "Carla Medeiros",
                serviceName = "Progressiva Orgânica",
                amount = 230.0,
                dateStr = "2026-09-20",
                paymentMethod = PaymentMethod.CARTAO_CREDITO,
                status = PaymentStatus.PAGO,
                paidAt = now - 10 * dayMillis
            ),
            PaymentTransaction(
                id = 7L,
                clientName = "Talita Nogueira",
                serviceName = "Mechas & Loiro Iluminado",
                amount = 290.0,
                dateStr = "2026-09-22",
                paymentMethod = PaymentMethod.PIX,
                status = PaymentStatus.PAGO,
                paidAt = now - 8 * dayMillis
            ),
            PaymentTransaction(
                id = 8L,
                clientName = "Bianca Castro",
                serviceName = "Manicure Tradicional",
                amount = 35.0,
                dateStr = "2026-09-23",
                paymentMethod = PaymentMethod.DINHEIRO,
                status = PaymentStatus.PAGO,
                paidAt = now - 7 * dayMillis
            ),
            PaymentTransaction(
                id = 9L,
                clientName = "Luciana Prado",
                serviceName = "Corte Feminino & Escova",
                amount = 85.0,
                dateStr = "2026-09-25",
                paymentMethod = PaymentMethod.PIX,
                status = PaymentStatus.PAGO,
                paidAt = now - 5 * dayMillis
            )
        )
    }

    val INITIAL_PRODUCTS = listOf(
        Product(
            id = 1L,
            name = "Óleo Oil Reflections 100ml",
            brand = "Wella Professionals",
            category = "Finalizadores",
            quantityInStock = 8,
            minStockAlert = 3,
            costPrice = 85.0,
            sellPrice = 145.0,
            barcode = "78912345601",
            description = "Nutrição e brilho luminoso com óleo de semente de macadâmia e abacate."
        ),
        Product(
            id = 2L,
            name = "Máscara Nutri Enrich 500g",
            brand = "Wella Professionals",
            category = "Tratamento",
            quantityInStock = 4,
            minStockAlert = 2,
            costPrice = 120.0,
            sellPrice = 210.0,
            barcode = "78912345602",
            description = "Nutrição instantânea para fios secos e desgastados com Goji Berry e Ácido Oleico."
        ),
        Product(
            id = 3L,
            name = "Truss Uso Obrigatório 260ml",
            brand = "Truss Professional",
            category = "Finalizadores",
            quantityInStock = 12,
            minStockAlert = 4,
            costPrice = 75.0,
            sellPrice = 135.0,
            barcode = "78912345603",
            description = "Reconstrutor capilar com proteção térmica, sela cutículas e anti-frizz."
        ),
        Product(
            id = 4L,
            name = "Kit Cronograma Capilar Braé Revival",
            brand = "Braé Hair Care",
            category = "Home Care",
            quantityInStock = 5,
            minStockAlert = 3,
            costPrice = 140.0,
            sellPrice = 250.0,
            barcode = "78912345604",
            description = "Kit completo com Shampoo, Condicionador e Ampola de resgate imediato."
        ),
        Product(
            id = 5L,
            name = "Coloração Color Touch 60g",
            brand = "Wella Professionals",
            category = "Coloração",
            quantityInStock = 15,
            minStockAlert = 5,
            costPrice = 32.0,
            sellPrice = 58.0,
            barcode = "78912345605",
            description = "Tonalizante multidimensional sem amônia para nuances personalizadas."
        ),
        Product(
            id = 6L,
            name = "Elixir Ultime L'Huile Originale 100ml",
            brand = "Kérastase",
            category = "Finalizadores",
            quantityInStock = 2,
            minStockAlert = 3,
            costPrice = 180.0,
            sellPrice = 310.0,
            barcode = "78912345606",
            description = "Óleo sublime com extrato de camélia francesa para brilho incomparável."
        )
    )

    fun getInitialScheduleBlocks(): List<ScheduleBlock> {
        val today = getTodayDateStr()
        return listOf(
            ScheduleBlock(
                id = 1L,
                professionalId = 1L,
                dateStr = today,
                startTime = "12:00",
                endTime = "13:00",
                reason = "Intervalo de Almoço - Vanira"
            ),
            ScheduleBlock(
                id = 2L,
                professionalId = 2L,
                dateStr = today,
                startTime = "12:30",
                endTime = "13:30",
                reason = "Intervalo de Almoço - Vanessa"
            )
        )
    }
}
