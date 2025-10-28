import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  "uz-Latn": {
    translation: {
      navbar: {
        bank_main: "Markaziy Bank",
        bank_sub: "O'zbekiston Respublikasi",
      },
      home: {
        title: "Markaziy Bank - Bosh Sahifa",
        description:
          "Valyuta kurslari, vakansiyalar, fikr-mulohazalar va so'nggi yangiliklar kabi muhim bank xizmatlariga kirish.",
        services_title: "Bank xizmatlari",
        services_description:
          "Moliyaviy ehtiyojlaringiz uchun mo'ljallangan raqamli xizmatlarimizdan foydalaning.",
        last_updated: "Oxirgi yangilanish",
        hero_title: "Markaziy bank rasmiy botiga xush kelibsiz",
        hero_subtitle: "Valyuta kurslari, vakansiyalar va so'nggi yangiliklar.",
        stats_active_customers: "Faol mijozlar",
        stats_branch_locations: "Filiallar",
        stats_online_services: "Onlayn xizmatlar",
        see_all_rates: "Barcha kurslar",
        services: {
          currency: {
            title: "Valyuta kurslari",
            description:
              "Asosiy valyutalar bo'yicha real vaqt kurslari va tarixiy ma'lumotlar",
          },
          vacancies: {
            title: "Vakansiyalar",
            description: "Bo'sh vakansiyalarni ko'ring va ariza yuboring",
          },
          applications: {
            title: "Murojaatlar",
            description: "Bankka yangi murojaat yuboring",
          },
          news: {
            title: "Yangiliklar",
            description:
              "Bank yangiliklari va siyosat yangilanishlari bilan tanishing",
          },
          access_service: "Xizmatga kirish",
        },
        quick_actions: {
          license: {
            title: "Litsenziya",
            subtitle: "Tekshirish",
          },
          vacancies: {
            title: "Vakansiyalar",
            subtitle: "Ko'rish",
          },
          application: {
            title: "Ariza",
            subtitle: "Topshirish",
          },
          news: {
            title: "Yangiliklar",
            subtitle: "O'qish",
          },
          currency: {
            title: "Valyuta",
            subtitle: "Hisoblash",
          },
        },
        currency_section: {
          title: "Valyuta kurslari",
          see_all_rates: "Barcha kurslar",
          loading: "Yuklanmoqda...",
          last_update: "Oxirgi yangilanish:",
          currency_code: "Valyuta kodi",
          rate_value: "Kurs qiymati",
          currency_unit: "so'm",
        },
        bank_info: {
          country: "O'zbekiston Respublikasi",
          bank_name: "Markaziy Bank",
        },
      },
      currency: {
        title: "Valyuta kurslari",
        subtitle: "O'zbekiston Markaziy bankining rasmiy kunlik kurslari",
        last_update: "17 Sentyabr, 2024 - 09:30",
        view_cards: "Karta ko'rinishi",
        view_table: "Jadval ko'rinishi",
        calculator: "Kalkulyator",
        back_to_dashboard: "Boshqaruv paneliga",
        daily_summary: "Kunlik kurslar xulosasi",
        official_rates: "Rasmiy kurslar",
        average_rate: "O'rtacha kurs",
        buy_rate: "Sotib olish",
        sell_rate: "Sotish",
        change: "O'zgarish",
        currency: "Valyuta",
        name: "Nomi",
        last_updated: "Oxirgi yangilanish",
        showing_currencies: "Valyutalar ko'rsatilmoqda",
        rates_updated: "Kurslar har 15 daqiqada yangilanadi",
        official_exchange_rates: "Rasmiy valyuta kurslari",
        rates_description:
          "Barcha valyuta kurslari O'zbekiston Markaziy banki tomonidan taqdim etiladi va har kuni 09:30 da yangilanadi. Bu kurslar faqat ma'lumot uchun va haqiqiy tranzaksiya kurslari farq qilishi mumkin.",
        updated_daily: "Har kuni yangilanadi",
        official_rates_text: "Rasmiy kurslar",
        central_bank_verified: "Markaziy bank tasdiqlangan",
        all_systems_operational: "Barcha tizimlar ishlamoqda",
        calculator_title: "Valyuta kalkulyatori",
        calculator_description:
          "Joriy kurslar yordamida valyutalar o'rtasida konvertatsiya qiling",
        amount: "Miqdor",
        from_currency: "Qaysi valyutadan",
        to_currency: "Qaysi valyutaga",
        converted_amount: "Konvertatsiya qilingan miqdor",
        calculating: "Hisoblanmoqda...",
        exchange_rate: "Valyuta kursi",
        rates_reference_only:
          "Kurslar faqat ma'lumot uchun. Haqiqiy kurslar farq qilishi mumkin.",
      },
      submissions: {
        title: "Murojaatlar",
        subtitle: "Murojaat turini tanlang",
        back_to_dashboard: "Bosh sahifaga qaytish",
        types: {
          consumer_rights: {
            title: "Iste'molchi huquqlari bo'yicha",
            description:
              "Iste'molchi huquqlari buzilishi haqida murojaat yuboring",
          },
          corruption: {
            title: "Korrupsiya bo'yicha",
            description: "Korrupsiya holatlari haqida xabar bering",
          },
        },
        form: {
          personal_info: "Shaxsiy ma'lumotlar",
          full_name: "To'liq ismingiz",
          full_name_placeholder: "Masalan: Karimov Karim Karimovich",
          phone: "Telefon raqam",
          email: "Elektron pochta",
          anonymous: "Anonim murojaat (shaxsiy ma'lumotlar ko'rsatilmaydi)",
          submission_details: "Murojaat tafsilotlari",
          subject: "Mavzu",
          subject_placeholder: "Murojaat mavzusini kiriting",
          description: "Batafsil tavsif",
          description_placeholder: "Murojaatingizni batafsil yozing...",
          privacy_title: "Maxfiylik va xavfsizlik",
          privacy_message:
            "Sizning murojaatingiz maxfiy bo'lib, faqat tegishli bo'limlar tomonidan ko'rib chiqiladi.",
          cancel: "Bekor qilish",
          submit: "Murojaat yuborish",
          submitting: "Yuborilmoqda...",
          success_title: "Murojaat muvaffaqiyatli yuborildi!",
          success_message:
            "Sizning murojaatingiz qabul qilindi va tez orada ko'rib chiqiladi.",
          reference_number: "Murojaat raqami",
          back_to_submissions: "Murojaatlarga qaytish",
          back_to_dashboard: "Bosh sahifaga qaytish",
        },
      },
      bottom_nav: {
        home: "Bosh sahifa",
        currency: "Valyuta kurslari",
        news: "Yangiliklar",
        jobs: "Vakansiyalar",
        feedback: "Fikr-mulohaza",
        submissions: "Murojaatlar",
        profile: "Profil",
      },
      profile: {
        title: "Profil",
        subtitle: "Shaxsiy ma'lumotlar va sozlamalar",
        status: {
          active: "Faol",
        },
        tabs: {
          profile: "Profil",
        },
        actions: {
          my_applications: "Arizalarim",
          my_applications_desc:
            "Vakansiyaga topshirilgan arizalaringizni ko'ring",
          help: "Yordam",
          help_desc: "Tez-tez so'raladigan savollar",
        },
      },
      jobs: {
        title: "Vakansiyalar",
        subtitle: "Markaziy Bank departamentlari va bo'limlari",
        departments_title: "Bo'limlar",
        departments_subtitle: "Qaysi bo'limda ishlashni xohlaysiz?",
        vacancies_title: "Bo'sh vakansiyalar",
        vacancies_subtitle: "Tanlangan bo'limdagi mavjud vakansiyalar",
        back_to_departments: "Bo'limlarga qaytish",
        view_details: "Tafsilotlarni ko'rish",
        apply_now: "Ariza berish",
        no_vacancies: "Hozircha vakansiyalar yo'q",
        no_vacancies_desc:
          "Bu bo'limda hozircha bo'sh vakansiyalar mavjud emas",
        departments: {
          information_technology: {
            name: "Axborot Texnologiyalari Departamenti",
            description:
              "IT infratuzilmasini boshqarish, raqamli bank xizmatlarini ishlab chiqish va kiberxavfsizlikni ta'minlash",
          },
        },
        department_tasks: {
          title: "Bo'lim vazifalari",
          show_details: "Batafsil ko'rish",
          hide_details: "Yashirish",
          tasks: [
            "Respublika miqyosida banklararo va bankning ichki to'lov tizimlarini hamda xalqaro hisob-kitoblar texnologiyasini jahon andozalariga mos ravishda takomillashtirish",
            "Real vaqt tartibiga asoslangan va hisob-kitoblarning ishonchlilik darajasini oshirishga yo'naltirilgan to'lov tizimini tashkil etish",
            "Bank plastik kartalari asosida hisob-kitoblar tizimini rivojlantirish ishlarini tashkil etish",
            "Masofaviy bank xizmatlarini ko'rsatishni takomillashtirish ishlarini muvofiqlashtirish",
            "Banklararo hisob-kitoblarni to'g'ri va o'z vaqtida amalga oshirilishini nazorat qilish",
            "Respublika bank tizimida zamonaviy axborot-kommunikatsiya texnologiyalari asosida aholiga masofaviy bank xizmatlarini ko'rsatish",
            "Markaziy bank va umuman bank tizimi faoliyatida zamonaviy texnologiyalarga asoslangan telekommunikatsiya tizimlarini ishlab chiqib tatbiq etish",
            "Davlat boshqaruvi idoralari va bank tizimi o'rtasida zamonaviy axborot texnologiyalarini joriy etilishi bo'yicha masalalarni ko'rib chiqish",
            "Markaziy bankning veb-saytini faol ishchi holatini ta'minlash",
          ],
        },
        open_positions: "Bo'sh vakansiyalar",
        available_positions: "Mavjud vakansiyalar",
        department_not_found: "Bo'lim topilmadi",
        department_not_found_desc: "Qidirilayotgan bo'lim mavjud emas.",
        back_to_departments: "Bo'limlarga qaytish",
        no_vacancies_available: "Hozircha vakansiyalar yo'q",
        no_vacancies_available_desc:
          "Bu bo'limda hozircha bo'sh vakansiyalar mavjud emas.",
        days_left: "kun qoldi",
        deadline_passed: "Muddat tugagan",
        open: "Ochiq",
        closed: "Yopiq",
        test_period: "Test sinovlari",
        application_deadline: "Ariza berish muddati",
        key_requirements: "Asosiy talablar",
        view_details: "Tafsilotlarni ko'rish",
        more: "yana",
        search_departments: "Bo'limlarni qidirish",
        search_placeholder: "Bo'lim nomini kiriting...",
        no_departments_found: "Hech qanday bo'lim topilmadi",
        clear_search: "Tozalash",
        vacancy: {
          location: "Joylashuv",
          type: "Ish turi",
          deadline: "Muddat",
          salary: "Maosh",
          description: "Tavsif",
          requirements: "Talablar",
          responsibilities: "Vazifalar",
          benefits: "Imtiyozlar",
          full_time: "To'liq vaqt",
          part_time: "Qisman vaqt",
          contract: "Shartnoma",
          internship: "Stajirovka",
        },
        vacancy_detail: {
          error_loading_title: "Vakansiya yuklanmadi",
          vacancy_not_found: "Vakansiya topilmadi",
          deadline_passed: "Muddat o'tgan",
          closed: "Yopiq",
          apply_now: "Ariza topshirish",
        },
        terms_conditions: {
          back: "Orqaga",
          title: "Shartnoma va Yo'riqnomalar",
          video_instructions: "Video Ko'rsatma",
          video_description: "Ariza topshirish jarayoni haqida video ko'rsatma",
          video_not_supported:
            "Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi",
          continue: "Davom etish",
          vacancy_info_missing:
            "Vakansiya ma'lumotlari topilmadi. Bosh sahifaga qayting.",
          agreement_text:
            "Men yuqorida keltirilgan shartlarni to'liq o'qib chiqdim va ularni qabul qilaman.",
          agreement_consent:
            "Shaxsiy ma'lumotlarimni qayta ishlashga roziman va ariza topshirish jarayonini davom ettirishni xohlayman.",
          contact_info:
            "Barcha savol va takliflaringizni info@cbu.uz manziliga yuborishingiz mumkin.",
          contract_title:
            "Shaxsga doir ma'lumotlarga ishlov berish bo'yicha shartnoma",
          section_1_title: "1. Atamalar",
          section_2_title: "2. Umumiy qoidalar",
          section_3_title:
            "3. Foydalanuvchi tomonidan Operatorga yetkazilishi kerak bo'lgan shaxsiy va boshqa ma'lumotlar ro'yxati",
          section_4_title:
            "4. Shaxsiy ma'lumotlarni yig'ish va ulardan foydalanish maqsadlari, qoidalari",
          section_5_title: "5. Boshqa shartlar",
          contract_content: {
            section_1_intro:
              "Shaxsga doir ma'lumotlarga ishlov berish to'g'risidagi shartnomada (keyingi o'rinlarda Shartnoma) keltirilgan atamalar quyidagi ta'riflarga ega:",
            telegram_bot:
              "Telegram bot (keyingi o'rinlarda Bot) – bu odamlar uchun mo'ljallanib, interfeyslar orqali avtomatik ravishda maxsus dastur va / yoki belgilangan jadvalga muvofiq, amalga oshiriladigan har qanday harakatlar.",
            operator:
              "Operator – mustaqil ravishda boshqa shaxslar bilan birgalikda shaxsiy ma'lumotlarni qayta ishlashni tashkil etadigan, shuningdek shaxsiy ma'lumotlarni qayta ishlash maqsadlarini aniqlaadigan, shaxsiy ma'lumotlar tarkibiga ishlov beradigan harakatlar (operatsiyalar)ni amalga oshiruvchi davlat yoki shahar idorasi, yuridik yoki jismoniy shaxs.",
            user: "Foydalanuvchi – Botning ma'lumotlar kiritish maydonlarini to'ldirgan har qanday shaxs (ro'yxatdan o'tgan yoki boshqa har qanday harakatlarni amalga oshirgan).",
            personal_data:
              "Shaxsiy ma'lumotlar – Botga foydalanuvchi (shaxsiy ma'lumotlar egasi) tomonidan kiritilgan va unga bevosita yoki bilvosita aloqador bo'lgan ma'lumotlar.",
            contract_acceptance:
              "Shartnoma aksepti – Botdagi maydonlarni ma'lumotlar kirib to'ldirish orqali barcha shartlarni to'liq va so'zsiz qabul qilish bo'yicha kelishuvlar.",
            section_2_1:
              "Ushbu Shartnoma O'zbekiston Respublikasining 02.07.2019 yildagi O'RK-547-sonli \"Shaxsga doir ma'lumotlar to'g'risida\" Qonuni talablari asosida tuzilgan va Operator bajarishi mumkin bo'lgan barcha shaxsiy ma'lumotlarga nisbatan qo'llaniladi Operator Botdan foydalanishda foydalanuvchi haqida ma'lumotlarni olishi mumkin.",
            section_2_2:
              "Botga foydalanuvchi tomonidan maydonlarni to'ldirish orqali ma'lumotlarni kirish Shartnoma akseptining barcha shartlari bilan foydalanuvchining so'zsiz roziligini anglatadi. Ushbu shartlarga rozi bo'lmagan taqdirda Foydalanuvchi Botdan foydalanmasligi lozim.",
            section_2_3:
              "Operatorga shaxsiy ma'lumotlarni taqdim etishga foydalanuvchining roziligi ularni Operator tomonidan qayta ishlash faoliyati tugatilguniga yoki Operator yoki foydalanuvchi roziligini qaytarib olguniga qadar amal qiladi. Shartnomani qabul qilgan foydalanuvchi Botdan foydalanish o'z xohishi bilan amalga oshirganini, bu uning manfaati uchun harakat qilishini va shaxsiy ma'lumotlarini qayta ishlashga rozi bo'lganini tasdiqlaydi. Shaxsiy ma'lumotlarni qayta ishlash O'zbekiston Respublikasining 02.07.2019 yildagi O'RK-547-son \"Shaxsiy ma'lumotlar to'g'risida\"gi qonuni asosida amalga oshirilishi to'g'risida foydalanuvchi ogohlantiriladi.",
            section_3_1:
              "Foydalanuvchi tomonidan Botdan foydalanilganda Operatorga quyidagi Shaxsiy ma'lumotlar taqdim etiladi:",
            section_3_1_1:
              "Foydalanuvchining Botdagi ma'lumotlar kiritish maydonlarini to'ldirishda kiritgan o'zi haqida ishonchli shaxsiy ma'lumotlari shu jumladan: familiyasi, ismi, otasining ismi, elektron pochta manzili, telefon raqami va boshqalar.",
            section_3_1_2:
              "Jarayon davomida qurilmada o'rnatilgan dasturiy ta'minot orqali Bot xizmatlariga avtomatik ravishda uzatiladigan ma'lumotlar, shu jumladan IP-manzil, cookie-fayllardan olingan ma'lumotlar, foydalanuvchi brauzeri (yoki u bilan birga bo'lgan boshqa dastur) haqida ma'lumot xizmatlari.",
            section_4_1:
              "Operator Foydalanuvchiga xizmatlar ko'rsatish uchun zarur bo'lgan shaxsiy ma'lumotlarni qayta ishlaydi.",
            section_4_2:
              "Foydalanuvchining shaxsiy ma'lumotlaridan Operator quyidagi maqsadlarda foydalanadi:",
            section_4_2_1: "Foydalanuvchining identifikatori.",
            section_4_2_2:
              "Foydalanuvchiga Botning shaxsiylashtirilgan xizmatlar va xizmatlarini taqdim etish.",
            section_4_2_3:
              "Bot orqali foydalanuvchi bilan aloqani saqlash, shu jumladan foydalanish bilan bog'liq xabarnomalar, so'rovlar va ma'lumotlarni yuborish Bot xizmatlarni taqdim etish, shuningdek so'rov va arizalarni ko'rib chiqish.",
            section_5_1:
              "Operator foyda ko'rmaslik, ma'lumot yoki tejamni yo'qotish, Botdan foydalanish yoki uni ishlata olmaslik bilan bog'liq har qanday zarar uchun foydalanuvchi oldida javobgar emas.",
            section_5_2:
              "Ushbu Shartnomadan kelib chiqadigan barcha mumkin bo'lgan nizolar O'zbekiston Respublikasining amaldagi qonunchiligiga muvofiq ko'rib chiqiladi.",
            section_5_3:
              "Operator ushbu Shartnomaga foydalanuvchiga hech qanday maxsus xabarnoma yubormay o'zgartirish kiritish huquqiga ega. Shartnomaning yangi tahriri e'lon qilingan kundan e'tiboran kuchga kiradi.",
            section_5_4:
              "Shaxsiy ma'lumotlarni qayta ishlashga rozilikni bekor qilish Operatorga tegishli yozma xabar (qo'lda yozilgan va Foydalanuvchi tomonidan imzolangan) yuborish orqali amalga oshirilishi mumkin.",
          },
        },
        application: {
          title: "Ariza berish",
          personal_info: "Shaxsiy ma'lumotlar",
          contact_info: "Aloqa ma'lumotlari",
          experience: "Tajriba",
          education: "Ta'lim",
          skills: "Ko'nikmalar",
          cover_letter: "Motivatsiya xati",
          resume: "Rezyume",
          submit: "Arizani yuborish",
          success: "Ariza muvaffaqiyatli yuborildi",
          error: "Xatolik yuz berdi",
          form: {
            title: "Vakansiyalarga ariza",
            personal_info: "Shaxsiy ma'lumotlar",
            full_name: "To'liq ismingizni kiriting",
            full_name_placeholder: "Masalan: Kalandarov Kalandar Kalandarovich",
            birth_date: "Tug'ilgan sanangizni belgilang",
            phone_number: "Telefon raqamingizni kiriting",
            education: "Ma'lumotingiz",
            start_year: "Boshlanish yili",
            end_year: "Tugash yili",
            select_year: "Yilni tanlang",
            currently_studying: "Hozirgi kunda o'qiyapman",
            education_period: "Tahsil olgan davr",
            education_period_placeholder: "2015-2019",
            institution: "Muassasa nomi",
            institution_placeholder: "Toshkent davlat iqtisodiyot universiteti",
            degree: "Daraja",
            degree_placeholder: "magistr",
            specialty: "Mutaxassisligi",
            specialty_placeholder: "iqtisodiyot",
            add_education: "Yana ta'lim ma'lumoti qo'shish",
            remove_education: "O'chirish",
            work_experience: "Mehnat faoliyatingiz",
            work_period: "Ish davri",
            work_period_placeholder: "2019-2021",
            currently_working: "Hozirgi kunda ishlayapman",
            company: "Muassasa nomi",
            company_placeholder: "O'zR Markaziy banki",
            position: "Lavozimi",
            position_placeholder: "yuridik departamentida bosh mutaxassis",
            add_work: "Yana ish tajribasi qo'shish",
            remove_work: "O'chirish",
            language_proficiency: "Til bilish darajalari",
            uzbek_language: "O'zbek tili",
            russian_language: "Rus tili",
            english_language: "Ingliz tili",
            dont_know: "Bilmayman",
            beginner: "Boshlang'ich",
            intermediate: "O'rta",
            excellent: "A'lo",
            salary_range: "Oylik maosh diapazoni",
            salary_range_select: "Maosh diapazonini tanlang",
            salary_range_placeholder: "Tanlang",
            salary_5_6: "5mln-6mln",
            salary_6_7: "6mln-7mln",
            salary_7_8: "7mln-8mln",
            salary_8_9: "8mln-9mln",
            salary_9_10: "9mln-10mln",
            salary_10_plus: "10mln dan ortiq",
            criminal_record: "Qonunchilik",
            criminal_record_question: "Jinoiy javobgarlikka tortilganmi?",
            additional_info: "Qo'shimcha ma'lumot",
            additional_info_placeholder: "Qo'shimcha ma'lumotlarni kiriting...",
            back_button: "Orqaga",
            submit_button: "TOPSHIRISH",
            success_message: "Ariza muvaffaqiyatli yuborildi!",
            error_message:
              "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
            submitting: "Yuborilmoqda...",
            department_info: "Buyruq: {departmentId} | Vakansiya: {vacancyId}",
          },
        },
      },
      test: {
        title: "Mutaxassislik testi",
        default_test_title: "Umumiy bilim testi",
        default_test_description:
          "Markaziy Bank mutaxassisligi bo'yicha umumiy bilim testi",
        back_button: "Orqaga",
        progress: "Jarayon",
        answered: "Javob berilgan",
        question: "Savol",
        next: "Keyingi",
        previous: "Oldingi",
        submit: "Testni yakunlash",
        submitting: "Yuborilmoqda...",
        question_navigator: "Savollar ro'yxati",
        error_loading: "Yuklanishda xatolik",
        vacancy_not_found: "Vakansiya topilmadi",
        leave_warning:
          "Testni tark etsangiz, javoblaringiz saqlanmaydi. Davom etasizmi?",
        unanswered_warning:
          "{{count}} ta savolga javob berilmadi. Testni yakunlashni xohlaysizmi?",
        success_message: "Test muvaffaqiyatli topshirildi!",
        error_message: "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
        security: {
          no_right_click: "Sichqonchaning o'ng tugmasi bloklangan!",
          no_devtools: "Dasturchi vositalari bloklangan!",
          no_screenshot: "Skrinshot olish bloklangan!",
          no_copy_paste: "Nusxa olish/qo'yish bloklangan!",
          no_print: "Chop etish bloklangan!",
          tab_switch_warning: "Ogohlantirish: Boshqa varaqqa o'tdingiz!",
          fullscreen_exit_warning:
            "Ogohlantirish: To'liq ekran rejimidan chiqdingiz!",
          devtools_detected: "Dasturchi vositalari aniqlandi! Iltimos, yoping.",
          page_leave_warning:
            "Test davom etmoqda! Sahifadan chiqsangiz, barcha javoblaringiz yo'qoladi!",
          violation_warning:
            "Ogohlantirish! Qoidabuzarlik {{count}}/5. {{remaining}} ta imkoniyat qoldi!",
          blocked_title: "TESTDAN CHETLATISH",
          blocked_subtitle: "O'zbekiston Respublikasi Markaziy Banki",
          blocked_description:
            "Siz test jarayonida ko'p marta qoidabuzarlik qildingiz. Test qoidalariga rioya qilmaslik sababli, sizning test natijalaringiz bekor qilingan va testga qayta kirish imkoniyati cheklangan.",
          blocked_reason_title: "Chetlatish sababi",
          blocked_reason:
            "Test qoidalarini 5 marta buzish sababli, sizning test sessiyangiz to'xtatildi va natijalar bekor qilindi.",
          blocked_message:
            "Siz testdan chetlatildingiz! 5 marta qoidabuzarlik qildingiz.",
          go_home: "Bosh sahifaga qaytish",
        },
        violation_modal: {
          title: "QOIDABUZARLIK ANIQLANDI",
          official_warning: "Rasmiy ogohlantirish",
          violation_type: "Qoidabuzarlik turi",
          screenshot_detected: "Ekran rasmini olish urinishi aniqlandi",
          tab_switch_detected: "Boshqa dastur yoki oynaga o'tish aniqlandi",
          page_leave_detected: "Test sahifasidan chiqish urinishi aniqlandi",
          current_violations: "Qoidabuzarliklar soni",
          remaining: "{{count}} ta imkoniyat qoldi",
          warning_message:
            "5 marta qoidabuzarlik qilsangiz, testdan butunlay chetlatilasiz va natijangiz bekor hisoblanadi.",
          understood: "Tushundim",
        },
        already_submitted: {
          title: "TEST ALLAQACHON TOPSHIRILGAN",
          subtitle: "O'zbekiston Respublikasi Markaziy Banki",
          description:
            "Sizning test natijalaringiz allaqachon tizimda qayd etilgan. Bir xil testni takroriy topshirish qoidalarga ko'ra taqiqlanadi.",
          previous_result: "Topshirilgan natijalar",
          status: "Holat",
          passed: "O'TKAZILDI",
          failed: "O'TKAZILMADI",
        },
        result: {
          passed_title: "Tabriklaymiz! Testdan o'tdingiz",
          failed_title: "Afsuski, testdan o'ta olmadingiz",
          passed_message: "Siz testni muvaffaqiyatli topshirdingiz!",
          failed_message: "Keyingi safar ko'proq tayyorgarlik ko'ring.",
          your_score: "Sizning natijangiz",
          correct_answers: "To'g'ri javoblar",
          wrong_answers: "Noto'g'ri javoblar",
          time_spent: "Sarflangan vaqt",
          minutes: "daqiqa",
          pass_info:
            "Siz kamida 50% to'g'ri javob berdingiz va testdan muvaffaqiyatli o'tdingiz!",
          fail_info:
            "Testdan o'tish uchun kamida 50% to'g'ri javob berish kerak edi.",
          go_home: "Bosh sahifaga qaytish",
        },
        questions: {
          q1: {
            question:
              "O'zbekiston Respublikasi Markaziy banki qachon tashkil etilgan?",
            a: "1991 yil 1 sentyabr",
            b: "1991 yil 1 yanvar",
            c: "1992 yil 1 yanvar",
            d: "1990 yil 1 sentyabr",
          },
          q2: {
            question: "Markaziy bankning asosiy vazifasi nima?",
            a: "Respublika byudjeti daromadlarini to'plash",
            b: "Milliy valyuta barqarorligini ta'minlash",
            c: "Korxonalarni moliyalashtirish",
            d: "Davlat qarzlarini boshqarish",
          },
          q3: {
            question: "O'zbekiston milliy valyutasi nima?",
            a: "Rubl",
            b: "Dollar",
            c: "So'm",
            d: "Tenge",
          },
          q4: {
            question: "Kadrlar bo'limining asosiy vazifasi nima?",
            a: "Moliyaviy hisobotlar tayyorlash",
            b: "Xodimlarni tanlash va rivojlantirish",
            c: "Marketing tadqiqotlari o'tkazish",
            d: "Texnik ta'minot",
          },
          q5: {
            question: "Bank xizmatchilarining asosiy sifatlaridan biri nima?",
            a: "Ma'suliyatlilik va halollik",
            b: "Yuqori ovozda gapirish",
            c: "Tez yurish",
            d: "Ko'p uxlash",
          },
          q6: {
            question: "Davlat tashkilotlarida qanday kiyinish kerak?",
            a: "Sport kiyimida",
            b: "Rasmiy biznes uslubida",
            c: "Erkin kiyimda",
            d: "Milliy libosda",
          },
          q7: {
            question: "Markaziy bank qaysi organga hisobot beradi?",
            a: "Vazirlar Mahkamasiga",
            b: "Prezidentga",
            c: "Oliy Majlisga",
            d: "Hech kimga",
          },
          q8: {
            question: "Bank xodimining asosiy huquqi nima?",
            a: "Istalgan vaqtda ishga kelmaslik",
            b: "Mehnat shartnomasi shartlariga rioya qilinishi",
            c: "Boshqalarning ishiga aralashish",
            d: "Buyruqlarni bajarmaslik",
          },
          q9: {
            question: "Hujjatlarni qanday saqlash kerak?",
            a: "Uyda",
            b: "Ko'chada",
            c: "Maxfiy joyda tartibli",
            d: "Kompyuter stolida ochiq",
          },
          q10: {
            question: "Mijoz bilan muloqot qoidalaridan biri:",
            a: "Qo'pol muomala qilish",
            b: "Xushmuomalalik va hurmat",
            c: "E'tibor bermaslik",
            d: "Baland ovozda gapirish",
          },
        },
      },
      not_found: {
        title: "Sahifa topilmadi",
        description:
          "Qidirilayotgan sahifa mavjud emas. Keling, sizni orqaga qaytaramiz!",
        go_back: "Orqaga qaytish",
        back_to_home: "Bosh sahifaga qaytish",
      },
    },
  },
  "uz-Cyrl": {
    translation: {
      navbar: {
        bank_main: "Марказий Банк",
        bank_sub: "Ўзбекистон Республикаси",
      },
      home: {
        title: "Марказий Банк - Бош Саҳифа",
        description:
          "Валюта курслари, вакансиялар, фикр-мулоҳазалар ва сўнгги янгиликлар каби муҳим банк хизматларига кириш.",
        services_title: "Банк хизматлари",
        services_description:
          "Молиявий эҳтиёжларингиз учун мўлжалланган рақамли хизматларимиздан фойдаланинг.",
        last_updated: "Сўнгги янгиланиш",
        hero_title: "Марказий банк расмий ботига хуш келибсиз",
        hero_subtitle: "Валюта курслари, вакансиялар ва сўнгги янгиликлар.",
        stats_active_customers: "Фаол мижозлар",
        stats_branch_locations: "Филиаллар",
        stats_online_services: "Онлайн хизматлар",
        see_all_rates: "Барча курслар",
        services: {
          currency: {
            title: "Валюта курслари",
            description:
              "Асосий валюталар бўйича реал вақт курслари ва тарихий маълумотлар",
          },
          vacancies: {
            title: "Вакансиялар",
            description: "Бўш вакансияларни кўринг ва ариза юборинг",
          },
          applications: {
            title: "Мурожаатлар",
            description: "Банкка янги мурожаат юборинг",
          },
          news: {
            title: "Янгиликлар",
            description:
              "Банк янгиликлари ва сиёсат янгиланишлари билан танишинг",
          },
          access_service: "Хизматга кириш",
        },
        quick_actions: {
          license: {
            title: "Лицензия",
            subtitle: "Текшириш",
          },
          vacancies: {
            title: "Вакансиялар",
            subtitle: "Кўриш",
          },
          application: {
            title: "Ариза",
            subtitle: "Топшириш",
          },
          news: {
            title: "Янгиликлар",
            subtitle: "Ўқиш",
          },
          currency: {
            title: "Валюта",
            subtitle: "Ҳисоблаш",
          },
        },
        currency_section: {
          title: "Валюта курслари",
          see_all_rates: "Барча курслар",
          loading: "Юкланмоқда...",
          last_update: "Сўнгги янгиланиш:",
          currency_code: "Валюта коди",
          rate_value: "Курс қиймати",
          currency_unit: "сўм",
        },
        bank_info: {
          country: "Ўзбекистон Республикаси",
          bank_name: "Марказий Банк",
        },
      },
      currency: {
        title: "Валюта курслари",
        subtitle: "Ўзбекистон Марказий банкининг расмий кунлик курслар",
        last_update: "17 Сентябр, 2024 - 09:30",
        view_cards: "Карта кўриниши",
        view_table: "Жадвал кўриниши",
        calculator: "Калкулятор",
        back_to_dashboard: "Бошқарув Панелига",
        daily_summary: "Кунлик курслар хулосаси",
        official_rates: "Расмий курслар",
        average_rate: "Ўртача курс",
        buy_rate: "Сотиб олиш",
        sell_rate: "Сотиш",
        change: "Ўзгариш",
        currency: "Валюта",
        name: "Номи",
        last_updated: "Сўнгги янгиланиш",
        showing_currencies: "Валюталар кўрсатилмоқда",
        rates_updated: "Курслар ҳар 15 дақиқада янгиланади",
        official_exchange_rates: "Расмий валюта курслари",
        rates_description:
          "Барча валюта курслари Ўзбекистон Марказий банки томонидан тақдим этилади ва ҳар кун 09:30 да янгиланади. Бу курслар фақат маълумот учун ва ҳақиқий транзакция курслари фарқ қилиши мумкин.",
        updated_daily: "Ҳар кун янгиланади",
        official_rates_text: "Расмий курслар",
        central_bank_verified: "Марказий банк тасдиқланган",
        all_systems_operational: "Барча тизимлар ишламоқда",
        calculator_title: "Валюта калкулятори",
        calculator_description:
          "Жорий курслар ёрдамида валюталар ўртасида конвертация қилинг",
        amount: "Миқдор",
        from_currency: "Қайси валютадан",
        to_currency: "Қайси валютага",
        converted_amount: "Конвертация қилинган миқдор",
        calculating: "Ҳисобланмоқда...",
        exchange_rate: "Валюта курси",
        rates_reference_only:
          "Курслар фақат маълумот учун. Ҳақиқий курслар фарқ қилиши мумкин.",
      },
      submissions: {
        title: "Мурожаатлар",
        subtitle: "Мурожаат турини танланг",
        back_to_dashboard: "Бош саҳифага қайтиш",
        types: {
          consumer_rights: {
            title: "Истеъмолчи ҳуқуқлари бўйича",
            description:
              "Истеъмолчи ҳуқуқлари бузилиши ҳақида мурожаат юборинг",
          },
          corruption: {
            title: "Коррупция бўйича",
            description: "Коррупция ҳолатлари ҳақида хабар беринг",
          },
        },
        form: {
          personal_info: "Шахсий маълумотлар",
          full_name: "Тўлиқ исмингиз",
          full_name_placeholder: "Масалан: Каримов Карим Каримович",
          phone: "Телефон рақам",
          email: "Электрон почта",
          anonymous: "Аноним мурожаат (шахсий маълумотлар кўрсатилмайди)",
          submission_details: "Мурожаат тафсилотлари",
          subject: "Мавзу",
          subject_placeholder: "Мурожаат мавзусини киритинг",
          description: "Батафсил тавсиф",
          description_placeholder: "Мурожаатингизни батафсил ёзинг...",
          privacy_title: "Махфийлик ва хавфсизлик",
          privacy_message:
            "Сизнинг мурожаатингиз махфий бўлиб, фақат тегишли бўлимлар томонидан кўриб чиқилади.",
          cancel: "Бекор қилиш",
          submit: "Мурожаат юбориш",
          submitting: "Юборилмоқда...",
          success_title: "Мурожаат муваффақиятли юборилди!",
          success_message:
            "Сизнинг мурожаатингиз қабул қилинди ва тез орада кўриб чиқилади.",
          reference_number: "Мурожаат рақами",
          back_to_submissions: "Мурожаатларга қайтиш",
          back_to_dashboard: "Бош саҳифага қайтиш",
        },
      },
      bottom_nav: {
        home: "Бош саҳифа",
        currency: "Валюта курслари",
        news: "Янгиликлар",
        jobs: "Вакансиялар",
        feedback: "Фикр-мулоҳаза",
        submissions: "Мурожаатлар",
        profile: "Профил",
      },
      profile: {
        title: "Профил",
        subtitle: "Шахсий маълумотлар ва созламалар",
        status: {
          active: "Фаол",
        },
        tabs: {
          profile: "Профил",
        },
        actions: {
          my_applications: "Аризаларим",
          my_applications_desc: "Вакансияга топширилган аризаларингизни кўринг",
          help: "Ёрдам",
          help_desc: "Тез-тез сўраладиган саволлар",
        },
      },
      jobs: {
        title: "Вакансиялар",
        subtitle: "Марказий Банк департаментлари ва бўлимлари",
        departments_title: "Бўлимлар",
        departments_subtitle: "Қайси бўлимда ишлашни хоҳлайсиз?",
        vacancies_title: "Бўш вакансиялар",
        vacancies_subtitle: "Танланган бўлимдаги мавжуд вакансиялар",
        back_to_departments: "Бўлимларга қайтиш",
        view_details: "Тафсилотларни кўриш",
        apply_now: "Ариза бериш",
        no_vacancies: "Ҳозирча вакансиялар йўқ",
        no_vacancies_desc: "Бу бўлимда ҳозирча бўш вакансиялар мавжуд эмас",
        departments: {
          information_technology: {
            name: "Ахборот Технологиялари Департаменти",
            description:
              "IT инфратузилмасини бошқариш, рақамли банк хизматларини ишлаб чиқиш ва киберхавфсизликни таъминлаш",
          },
        },
        department_tasks: {
          title: "Бўлим вазифалари",
          show_details: "Батафсил кўриш",
          hide_details: "Яшириш",
          tasks: [
            "Республика миқёсида банклараро ва банкнинг ички тўлов тизимларини ҳамда халқаро ҳисоб-китоблар технологиясини жаҳон андозаларига мос равишда такомиллаштириш",
            "Реал вақт тартибига асосланган ва ҳисоб-китобларнинг ишончлилик даражасини оширишга йўналтирилган тўлов тизимини ташкил этиш",
            "Банк пластик карталари асосида ҳисоб-китоблар тизимини ривожлантириш ишларини ташкил этиш",
            "Масофавий банк хизматлари кўрсатишни такомиллаштириш ишларини мувофиқлаштириш",
            "Банклараро ҳисоб-китобларни тўғри ва ўз вақтида амалга оширилишини назорат қилиш",
            "Республика банк тизимида замонавий ахборот-коммуникация технологиялари асосида аҳолига масофавий банк хизматларини кўрсатиш",
            "Марказий банк ва умуман банк тизими фаолиятида замонавий технологияларга асосланган телекоммуникация тизимларини ишлаб чиқиб тадбиқ этиш",
            "Давлат бошқаруви идоралари ва банк тизими ўртасида замонавий ахборот технологияларини жорий этилиши бўйича масалаларни кўриб чиқиш",
            "Марказий банкнинг веб-сайтини фаол ишчи ҳолатини таъминлаш",
          ],
        },
        open_positions: "Бўш вакансиялар",
        available_positions: "Мавжуд вакансиялар",
        department_not_found: "Бўлим топилмади",
        department_not_found_desc: "Қидирилаётган бўлим мавжуд эмас.",
        back_to_departments: "Бўлимларга қайтиш",
        no_vacancies_available: "Ҳозирча вакансиялар йўқ",
        no_vacancies_available_desc:
          "Бу бўлимда ҳозирча бўш вакансиялар мавжуд эмас.",
        days_left: "кун қолди",
        deadline_passed: "Муддат тугаган",
        open: "Очиқ",
        closed: "Ёпиқ",
        test_period: "Тест синовлари",
        application_deadline: "Ариза бериш муддати",
        key_requirements: "Асосий талаблар",
        view_details: "Тафсилотларни кўриш",
        more: "яна",
        search_departments: "Бўлимларни қидириш",
        search_placeholder: "Бўлим номини киритинг...",
        no_departments_found: "Ҳеч қандай бўлим топилмади",
        clear_search: "Тозалаш",
        vacancy: {
          location: "Жойлашув",
          type: "Иш тури",
          deadline: "Муддат",
          salary: "Маош",
          description: "Тавсиф",
          requirements: "Талаблар",
          responsibilities: "Вазифалар",
          benefits: "Имтиёзлар",
          full_time: "Тўлиқ вақт",
          part_time: "Қисман вақт",
          contract: "Шартнома",
          internship: "Стажировка",
        },
        vacancy_detail: {
          error_loading_title: "Вакансия юкланмади",
          vacancy_not_found: "Вакансия топилмади",
          deadline_passed: "Муддат ўтган",
          closed: "Ёпиқ",
          apply_now: "Ариза топшириш",
        },
        terms_conditions: {
          back: "Орқага",
          title: "Шартнома ва Йўриқномалар",
          video_instructions: "Видео Кўрсатма",
          video_description: "Ариза топшириш жараёни ҳақида видео кўрсатма",
          video_not_supported:
            "Сизнинг браузерингиз видео элементни қўллаб-қувватламайди",
          continue: "Давом этиш",
          vacancy_info_missing:
            "Вакансия маълумотлари топилмади. Бош саҳифага қайтинг.",
          agreement_text:
            "Мен юқорида келтирилган шартларни тўлиқ ўқиб чиқдим ва уларни қабул қиламан.",
          agreement_consent:
            "Шахсий маълумотларимни қайта ишлашга рози бўлиб, ариза топшириш жараёнини давом эттиришни хоҳлайман.",
          contact_info:
            "Барча савол ва таклифларингизни info@cbu.uz манзилига юборишингиз мумкин.",
          contract_title:
            "Шахсга доир маълумотларга ишлов бериш бўйича шартнома",
          section_1_title: "1. Атамалар",
          section_2_title: "2. Умумий қоидалар",
          section_3_title:
            "3. Фойдаланувчи томонидан Операторга етказилиши керак бўлган шахсий ва бошқа маълумотлар рўйхати",
          section_4_title:
            "4. Шахсий маълумотларни йиғиш ва улардан фойдаланиш мақсадлари, қоидалари",
          section_5_title: "5. Бошқа шартлар",
          contract_content: {
            section_1_intro:
              "Шахсга доир маълумотларга ишлов бериш тўғрисидаги шартномада (кейинги ўринларда Шартнома) келтирилган атамалар қуйидаги таърифларга эга:",
            telegram_bot:
              "Телеграм бот (кейинги ўринларда Бот) – бу одамлар учун мўлжалланиб, интерфейслар орқали автоматик равишда махсус дастур ва / ёки белгиланган жадвалга мувофиқ, амалга ошириладиган ҳар қандай ҳаракатлар.",
            operator:
              "Оператор – мустақил равишда бошқа шахслар билан биргаликда шахсий маълумотларни қайта ишлашни ташкил этадиган, шунингдек шахсий маълумотларни қайта ишлаш мақсадларини аниқлайдиган, шахсий маълумотлар таркибига ишлов берадиган ҳаракатлар (операциялар)ни амалга оширувчи давлат ёки шаҳар идораси, юридик ёки жисмоний шахс.",
            user: "Фойдаланувчи – Ботнинг маълумотлар киритиш майдонларини тўлдирган ҳар қандай шахс (рўйхатдан ўтган ёки бошқа ҳар қандай ҳаракатларни амалга оширган).",
            personal_data:
              "Шахсий маълумотлар – Ботга фойдаланувчи (шахсий маълумотлар эгаси) томонидан киритилган ва унга бевосита ёки билвосита алоқадор бўлган маълумотлар.",
            contract_acceptance:
              "Шартнома акцепти – Ботдаги майдонларни маълумотлар киритиб тўлдириш орқали барча шартларни тўлиқ ва сўзсиз қабул қилиш бўйича келишувлар.",
            section_2_1:
              'Ушбу Шартнома Ўзбекистон Республикасининг 02.07.2019 йилдаги ЎРҚ-547-сонли "Шахсга доир маълумотлар тўғрисида" Қонуни талаблари асосида тузилган ва Оператор бажариши мумкин бўлган барча шахсий маълумотларга нисбатан қўлланилади Оператор Ботдан фойдаланишда фойдаланувчи ҳақида маълумотларни олиши мумкин.',
            section_2_2:
              "Ботга фойдаланувчи томонидан майдонларни тўлдириш орқали маълумотларни киритиш Шартнома акцептининг барча шартлари билан фойдаланувчининг сўзсиз розилигини англатади. Ушбу шартларга рози бўлмаган тақдирда Фойдаланувчи Ботдан фойдаланмаслиги лозим.",
            section_2_3:
              'Операторга шахсий маълумотларни тақдим этишга фойдаланувчининг розилиги уларни Оператор томонидан қайта ишлаш фаолияти тугатилгунига ёки Оператор ёки фойдаланувчи розилигини қайтариб олгунига қадар амал қилади. Шартномани қабул қилган фойдаланувчи Ботдан фойдаланиш ўз хоҳиши билан амалга оширганини, бу унинг манфаати учун ҳаракат қилишини ва шахсий маълумотларини қайта ишлашга рози бўлганини тасдиқлайди. Шахсий маълумотларни қайта ишлаш Ўзбекистон Республикасининг 02.07.2019 йилдаги ЎРҚ-547-сон "Шахсий маълумотлар тўғрисида"ги қонуни асосида амалга оширилиши тўғрисида фойдаланувчи огоҳлантирилади.',
            section_3_1:
              "Фойдаланувчи томонидан Ботдан фойдаланилганда Операторга қуйидаги Шахсий маълумотлар тақдим этилади:",
            section_3_1_1:
              "Фойдаланувчининг Ботдаги маълумотларни киритиш майдонларини тўлдиришда киритган ўзи ҳақида ишончли шахсий маълумотлари шу жумладан: фамилияси, исми, отасининг исми, электрон почта манзили, телефон рақами ва бошқалар.",
            section_3_1_2:
              "Жараён давомида қурилмада ўрнатилган дастурий таъминот орқали Бот хизматларига автоматик равишда узатиладиган маълумотлар, шу жумладан IP-манзил, cookie-файллардан олинган маълумотлар, фойдаланувчи браузери (ёки у билан бирга бўлган бошқа дастур) ҳақида маълумот хизматлари.",
            section_4_1:
              "Оператор Фойдаланувчига хизматлар кўрсатиш учун зарур бўлган шахсий маълумотларни қайта ишлайди.",
            section_4_2:
              "Фойдаланувчининг шахсий маълумотларидан Оператор қуйидаги мақсадларда фойдаланади:",
            section_4_2_1: "Фойдаланувчининг идентификатори.",
            section_4_2_2:
              "Фойдаланувчига Ботнинг шахсийлаштирилган хизматлар ва хизматларини тақдим этиш.",
            section_4_2_3:
              "Бот орқали фойдаланувчи билан алоқани сақлаш, шу жумладан фойдаланиш билан боғлиқ хабарномалар, сўровлар ва маълумотларни юбориш Бот хизматларни тақдим этиш, шунингдек сўров ва аризаларни кўриб чиқиш.",
            section_5_1:
              "Оператор фойда кўрмаслик, маълумот ёки тежашни йўқотиш, Ботдан фойдаланиш ёки уни ишлата олмаслик билан боғлиқ ҳар қандай зарар учун фойдаланувчи олдида жавобгар эмас.",
            section_5_2:
              "Ушбу Шартномадан келиб чиқадиган барча мумкин бўлган низолар Ўзбекистон Республикасининг амалдаги қонунчилигига мувофиқ кўриб чиқилади.",
            section_5_3:
              "Оператор ушбу Шартномага фойдаланувчига ҳеч қандай махсус хабарнома юбормай ўзгартириш киритиш ҳуқуқига эга. Шартноманинг янги таҳрири эълон қилинган кундан эътиборан кучга киради.",
            section_5_4:
              "Шахсий маълумотларни қайта ишлашга розиликни бекор қилиш Операторга тегишли ёзма хабар (қўлда ёзилган ва Фойдаланувчи томонидан имзоланган) юбориш орқали амалга оширилиши мумкин.",
          },
        },
        application: {
          title: "Ариза бериш",
          personal_info: "Шахсий маълумотлар",
          contact_info: "Алоқа маълумотлари",
          experience: "Тажриба",
          education: "Таълим",
          skills: "Кўникмалар",
          cover_letter: "Мотивация хати",
          resume: "Резуме",
          submit: "Аризани юбориш",
          success: "Ариза муваффақиятли юборилди",
          error: "Хатолик юз берди",
          form: {
            title: "Вакансияларга ариза",
            personal_info: "Шахсий маълумотлар",
            full_name: "Тўлиқ исмингизни киритинг",
            full_name_placeholder: "Масалан: Каландаров Каландар Каландарович",
            birth_date: "Тугʻилган санангизни белгиланг",
            phone_number: "Телефон рақамингизни киритинг",
            education: "Маълумотингиз",
            start_year: "Бошланиш йили",
            end_year: "Тугаш йили",
            select_year: "Йилни танланг",
            currently_studying: "Ҳозирги кунда ўқияпман",
            education_period: "Тахсил олган давр",
            education_period_placeholder: "2015-2019",
            institution: "Муассаса номи",
            institution_placeholder: "Тошкент давлат иқтисодиёт университети",
            degree: "Даража",
            degree_placeholder: "магистр",
            specialty: "Мутахассислиги",
            specialty_placeholder: "иқтисодиёт",
            add_education: "Яна таълим маълумоти қўшиш",
            remove_education: "Учириш",
            work_experience: "Меҳнат фаолиятингиз",
            work_period: "Иш даври",
            work_period_placeholder: "2019-2021",
            currently_working: "Ҳозирги кунда ишлаяпман",
            company: "Муассаса номи",
            company_placeholder: "ЎзР Марказий банки",
            position: "Лавозими",
            position_placeholder: "юридик департаментида бош мутахассис",
            add_work: "Яна иш тажрибаси қўшиш",
            remove_work: "Учириш",
            language_proficiency: "Тил билиш даражалари",
            uzbek_language: "Ўзбек тили",
            russian_language: "Рус тили",
            english_language: "Инглиз тили",
            dont_know: "Билмайман",
            beginner: "Бошланғич",
            intermediate: "Ўрта",
            advanced: "Аъло",
            salary_range: "Ойлик маош диапазони",
            salary_range_select: "Маош диапазонини танланг",
            salary_range_placeholder: "Танланг",
            salary_5_6: "5mln-6mln",
            salary_6_7: "6mln-7mln",
            salary_7_8: "7mln-8mln",
            salary_8_9: "8mln-9mln",
            salary_9_10: "9mln-10mln",
            salary_10_plus: "10mln дан ортиқ",
            criminal_record: "Қонунчилик",
            criminal_record_question: "Жиноий жавобгарликка тортилганми?",
            additional_info: "Қўшимча маълумот",
            additional_info_placeholder: "Қўшимча маълумотларни киритинг...",
            back_button: "Орқага",
            submit_button: "ТОПШИРИШ",
            success_message: "Ариза муваффақиятли юборилди!",
            error_message: "Хатолик юз берди. Илтимос, қайтадан уриниб кўринг.",
            submitting: "Юборилмоқда...",
            department_info: "Буйруқ: {departmentId} | Вакансия: {vacancyId}",
          },
        },
      },
      test: {
        title: "Мутахассислик тести",
        default_test_title: "Умумий билим тести",
        default_test_description:
          "Марказий Банк мутахассислиги бўйича умумий билим тести",
        back_button: "Орқага",
        progress: "Жараён",
        answered: "Жавоб берилган",
        question: "Савол",
        next: "Кейинги",
        previous: "Олдинги",
        submit: "Тестни якунлаш",
        submitting: "Юборилмоқда...",
        question_navigator: "Саволлар рўйхати",
        error_loading: "Юкланишда хатолик",
        vacancy_not_found: "Вакансия топилмади",
        leave_warning:
          "Тестни тарк етсангиз, жавобларингиз сақланмайди. Давом етасизми?",
        unanswered_warning:
          "{{count}} та саволга жавоб берилмади. Тестни якунлашни хоҳлайсизми?",
        success_message: "Тест муваффақиятли топширилди!",
        error_message: "Хатолик юз берди. Илтимос, қайтадан уриниб кўринг.",
        security: {
          no_right_click: "Сичқончанинг ўнг тугмаси блокланган!",
          no_devtools: "Дастурчи воситалари блокланган!",
          no_screenshot: "Скриншот олиш блокланган!",
          no_copy_paste: "Нусха олиш/қўйиш блокланган!",
          no_print: "Чоп етиш блокланган!",
          tab_switch_warning: "Огоҳлантириш: Бошқа вараққа ўтдингиз!",
          fullscreen_exit_warning:
            "Огоҳлантириш: Тўлиқ екран режимидан чиқдингиз!",
          devtools_detected: "Дастурчи воситалари аниқланди! Илтимос, ёпинг.",
          page_leave_warning:
            "Тест давом етмоқда! Саҳифадан чиқсангиз, барча жавобларингиз йўқолади!",
          violation_warning:
            "Огоҳлантириш! Қоидабузарлик {{count}}/5. {{remaining}} та имконият қолди!",
          blocked_title: "ТЕСТДАН ЧЕТЛАТИШ",
          blocked_subtitle: "Ўзбекистон Республикаси Марказий Банки",
          blocked_description:
            "Сиз тест жараёнида кўп марта қоидабузарлик қилдингиз. Тест қоидаларига риоя қилмаслик сабабли, сизнинг тест натижаларингиз бекор қилинган ва тестга қайта кириш имконияти чекланган.",
          blocked_reason_title: "Четлатиш сабаби",
          blocked_reason:
            "Тест қоидаларини 5 марта бузиш сабабли, сизнинг тест сессиянгиз тўхтатилди ва натижалар бекор қилинди.",
          blocked_message:
            "Сиз тестдан четлатилдингиз! 5 марта қоидабузарлик қилдингиз.",
          go_home: "Бош саҳифага қайтиш",
        },
        violation_modal: {
          title: "ҚОИДАБУЗАРЛИК АНИҚЛАНДИ",
          official_warning: "Расмий огоҳлантириш",
          violation_type: "Қоидабузарлик тури",
          screenshot_detected: "Екран расмини олиш уриниши аниқланди",
          tab_switch_detected: "Бошқа дастур ёки ойнага ўтиш аниқланди",
          page_leave_detected: "Тест саҳифасидан чиқиш уриниши аниқланди",
          current_violations: "Қоидабузарликлар сони",
          remaining: "{{count}} та имконият қолди",
          warning_message:
            "5 марта қоидабузарлик қилсангиз, тестдан бутунлай четлатиласиз ва натижангиз бекор ҳисобланади.",
          understood: "Тушундим",
        },
        already_submitted: {
          title: "ТЕСТ АЛЛАҚАЧОН ТОПШИРИЛГАН",
          subtitle: "Ўзбекистон Республикаси Марказий Банки",
          description:
            "Сизнинг тест натижаларингиз аллақачон тизимда қайд етилган. Бир хил тестни такрорий топшириш қоидаларга кўра тақиқланади.",
          previous_result: "Топширилган натижалар",
          status: "Ҳолат",
          passed: "ЎТКАЗИЛДИ",
          failed: "ЎТКАЗИЛМАДИ",
        },
        result: {
          passed_title: "Табриклаймиз! Тестдан ўтдингиз",
          failed_title: "Афсуски, тестдан ўта олмадингиз",
          passed_message: "Сиз тестни муваффақиятли топширдингиз!",
          failed_message: "Кейинги сафар кўпроқ тайёргарлик кўринг.",
          your_score: "Сизнинг натижангиз",
          correct_answers: "Тўғри жавоблар",
          wrong_answers: "Нотўғри жавоблар",
          time_spent: "Сарфланган вақт",
          minutes: "дақиқа",
          pass_info:
            "Сиз камида 50% тўғри жавоб бердингиз ва тестдан муваффақиятли ўтдингиз!",
          fail_info:
            "Тестдан ўтиш учун камида 50% тўғри жавоб бериш керак еди.",
          go_home: "Бош саҳифага қайтиш",
        },
        questions: {
          q1: {
            question:
              "Ўзбекистон Республикаси Марказий банки қачон ташкил етилган?",
            a: "1991 йил 1 сентябр",
            b: "1991 йил 1 январ",
            c: "1992 йил 1 январ",
            d: "1990 йил 1 сентябр",
          },
          q2: {
            question: "Марказий банкнинг асосий вазифаси нима?",
            a: "Республика бюджети даромадларини тўплаш",
            b: "Миллий валюта барқарорлигини таъминлаш",
            c: "Корхоналарни молиялаштириш",
            d: "Давлат қарзларини бошқариш",
          },
          q3: {
            question: "Ўзбекистон миллий валютаси нима?",
            a: "Рубл",
            b: "Доллар",
            c: "Сўм",
            d: "Тенге",
          },
          q4: {
            question: "Кадрлар бўлимининг асосий вазифаси нима?",
            a: "Молиявий ҳисоботлар тайёрлаш",
            b: "Ходимларни танлаш ва ривожлантириш",
            c: "Маркетинг тадқиқотлари ўтказиш",
            d: "Техник таъминот",
          },
          q5: {
            question: "Банк хизматчиларининг асосий сифатларидан бири нима?",
            a: "Маъсулиятлилик ва ҳалоллик",
            b: "Юқори овозда гапириш",
            c: "Тез юриш",
            d: "Кўп ухлаш",
          },
          q6: {
            question: "Давлат ташкилотларида қандай кийиниш керак?",
            a: "Спорт кийимида",
            b: "Расмий бизнес услубида",
            c: "Эркин кийимда",
            d: "Миллий либосда",
          },
          q7: {
            question: "Марказий банк қайси органга ҳисобот беради?",
            a: "Вазирлар Маҳкамасига",
            b: "Президентга",
            c: "Олий Мажлисга",
            d: "Ҳеч кимга",
          },
          q8: {
            question: "Банк ходимининг асосий ҳуқуқи нима?",
            a: "Исталган вақтда ишга келмаслик",
            b: "Меҳнат шартномаси шартларига риоя қилиниши",
            c: "Бошқаларнинг ишига аралашиш",
            d: "Буйруқларни бажармаслик",
          },
          q9: {
            question: "Ҳужжатларни қандай сақлаш керак?",
            a: "Уйда",
            b: "Кўчада",
            c: "Махфий жойда тартибли",
            d: "Компютер столида очиқ",
          },
          q10: {
            question: "Мижоз билан мулоқот қоидаларидан бири:",
            a: "Қўпол муомала қилиш",
            b: "Хушмуомалалик ва ҳурмат",
            c: "Эътибор бермаслик",
            d: "Баланд овозда гапириш",
          },
        },
      },
      not_found: {
        title: "Саҳифа топилмади",
        description:
          "Қидирилаётган саҳифа мавжуд эмас. Келинг, сизни орқага қайтарамиз!",
        go_back: "Орқага қайтиш",
        back_to_home: "Бош саҳифага қайтиш",
      },
    },
  },
  ru: {
    translation: {
      navbar: {
        bank_main: "Центральный Банк",
        bank_sub: "Республики Узбекистан",
      },
      home: {
        title: "Центральный Банк - Главная",
        description:
          "Доступ к основным банковским услугам: курсы валют, вакансии, обратная связь и новости.",
        services_title: "Банковские услуги",
        services_description:
          "Воспользуйтесь нашим набором цифровых сервисов для ваших финансовых задач.",
        last_updated: "Последнее обновление",
        hero_title: "Добро пожаловать в официальный бот Центрального банка",
        hero_subtitle: "Курсы валют, вакансии и последние новости.",
        stats_active_customers: "Активные клиенты",
        stats_branch_locations: "Отделения",
        stats_online_services: "Онлайн сервисы",
        see_all_rates: "Все курсы",
        services: {
          currency: {
            title: "Курсы валют",
            description: "Онлайн-курсы основных валют и исторические данные",
          },
          vacancies: {
            title: "Вакансии",
            description: "Просматривайте вакансии и подавайте заявки",
          },
          applications: {
            title: "Обращения",
            description: "Отправьте новое обращение в банк",
          },
          news: {
            title: "Новости и обновления",
            description:
              "Будьте в курсе последних новостей и обновлений политики",
          },
          access_service: "Перейти к сервису",
        },
        quick_actions: {
          license: {
            title: "Лицензия",
            subtitle: "Проверка",
          },
          vacancies: {
            title: "Вакансии",
            subtitle: "Просмотр",
          },
          application: {
            title: "Заявка",
            subtitle: "Подача",
          },
          news: {
            title: "Новости",
            subtitle: "Чтение",
          },
          currency: {
            title: "Валюта",
            subtitle: "Расчет",
          },
        },
        currency_section: {
          title: "Курсы валют",
          see_all_rates: "Все курсы",
          loading: "Загрузка...",
          last_update: "Последнее обновление:",
          currency_code: "Код валюты",
          rate_value: "Курс",
          currency_unit: "сум",
        },
        bank_info: {
          country: "Республика Узбекистан",
          bank_name: "Центральный Банк",
        },
      },
      currency: {
        title: "Курсы валют",
        subtitle: "Официальные ежедневные курсы Центрального банка Узбекистана",
        last_update: "17 Сентября, 2024 - 09:30",
        view_cards: "Вид карточек",
        view_table: "Вид таблицы",
        calculator: "Калькулятор",
        back_to_dashboard: "На панель управления",
        daily_summary: "Сводка дневных курсов",
        official_rates: "Официальные курсы",
        average_rate: "Средний курс",
        buy_rate: "Покупка",
        sell_rate: "Продажа",
        change: "Изменение",
        currency: "Валюта",
        name: "Название",
        last_updated: "Последнее обновление",
        showing_currencies: "Показано валют",
        rates_updated: "Курсы обновляются каждые 15 минут",
        official_exchange_rates: "Официальные курсы валют",
        rates_description:
          "Все курсы валют предоставляются Центральным банком Узбекистана и обновляются ежедневно в 09:30. Эти курсы предназначены только для информации, и фактические курсы транзакций могут отличаться.",
        updated_daily: "Обновляется ежедневно",
        official_rates_text: "Официальные курсы",
        central_bank_verified: "Проверено Центральным банком",
        all_systems_operational: "Все системы работают",
        calculator_title: "Валютный калькулятор",
        calculator_description:
          "Конвертируйте между валютами используя текущие курсы",
        amount: "Сумма",
        from_currency: "Из валюты",
        to_currency: "В валюту",
        converted_amount: "Конвертированная сумма",
        calculating: "Вычисляется...",
        exchange_rate: "Курс обмена",
        rates_reference_only:
          "Курсы только для справки. Фактические курсы могут отличаться.",
      },
      submissions: {
        title: "Обращения",
        subtitle: "Выберите тип обращения",
        back_to_dashboard: "Вернуться на главную",
        types: {
          consumer_rights: {
            title: "По правам потребителей",
            description: "Отправьте обращение о нарушении прав потребителей",
          },
          corruption: {
            title: "По коррупции",
            description: "Сообщите о случаях коррупции",
          },
        },
        form: {
          personal_info: "Личная информация",
          full_name: "Полное имя",
          full_name_placeholder: "Например: Каримов Карим Каримович",
          phone: "Номер телефона",
          email: "Электронная почта",
          anonymous: "Анонимное обращение (личная информация не отображается)",
          submission_details: "Детали обращения",
          subject: "Тема",
          subject_placeholder: "Введите тему обращения",
          description: "Подробное описание",
          description_placeholder: "Напишите ваше обращение подробно...",
          privacy_title: "Конфиденциальность и безопасность",
          privacy_message:
            "Ваше обращение конфиденциально и будет рассмотрено только соответствующими отделами.",
          cancel: "Отменить",
          submit: "Отправить обращение",
          submitting: "Отправка...",
          success_title: "Обращение успешно отправлено!",
          success_message: "Ваше обращение принято и скоро будет рассмотрено.",
          reference_number: "Номер обращения",
          back_to_submissions: "Вернуться к обращениям",
          back_to_dashboard: "Вернуться на главную",
        },
      },
      bottom_nav: {
        home: "Главная",
        currency: "Курсы валют",
        news: "Новости",
        jobs: "Вакансии",
        feedback: "Обратная связь",
        submissions: "Обращения",
        profile: "Профиль",
      },
      profile: {
        title: "Профиль",
        subtitle: "Личные данные и настройки",
        status: {
          active: "Активен",
        },
        tabs: {
          profile: "Профиль",
        },
        actions: {
          my_applications: "Мои заявки",
          my_applications_desc: "Просматривайте поданные заявки на вакансии",
          help: "Помощь",
          help_desc: "Часто задаваемые вопросы",
        },
      },
      jobs: {
        title: "Вакансии",
        subtitle: "Департаменты и отделы Центрального банка",
        departments_title: "Отделы",
        departments_subtitle: "В каком отделе вы хотели бы работать?",
        vacancies_title: "Открытые вакансии",
        vacancies_subtitle: "Доступные вакансии в выбранном отделе",
        back_to_departments: "Вернуться к отделам",
        view_details: "Подробности",
        apply_now: "Подать заявку",
        no_vacancies: "Пока нет вакансий",
        no_vacancies_desc: "В этом отделе пока нет открытых вакансий",
        departments: {
          information_technology: {
            name: "Департамент Информационных Технологий",
            description:
              "Управление IT-инфраструктурой, разработка цифровых банковских решений и обеспечение кибербезопасности",
          },
        },
        department_tasks: {
          title: "Задачи отдела",
          show_details: "Показать подробности",
          hide_details: "Скрыть",
          tasks: [
            "Совершенствование межбанковских и внутрибанковских платежных систем, а также технологий международных расчетов в соответствии с мировыми стандартами на уровне республики",
            "Организация платежной системы, основанной на режиме реального времени и направленной на повышение надежности расчетов",
            "Организация работ по развитию системы расчетов на основе банковских пластиковых карт",
            "Координация работ по совершенствованию предоставления дистанционных банковских услуг",
            "Контроль за правильным и своевременным осуществлением межбанковских расчетов",
            "Предоставление населению дистанционных банковских услуг на основе современных информационно-коммуникационных технологий в банковской системе республики",
            "Разработка и внедрение телекоммуникационных систем, основанных на современных технологиях в деятельности Центрального банка и банковской системы в целом",
            "Рассмотрение вопросов внедрения современных информационных технологий между органами государственного управления и банковской системой",
            "Обеспечение активного рабочего состояния веб-сайта Центрального банка",
          ],
        },
        open_positions: "Открытые вакансии",
        available_positions: "Доступные вакансии",
        department_not_found: "Отдел не найден",
        department_not_found_desc: "Искомый отдел не существует.",
        back_to_departments: "Вернуться к отделам",
        no_vacancies_available: "Пока нет вакансий",
        no_vacancies_available_desc:
          "В этом отделе пока нет открытых вакансий.",
        days_left: "дней осталось",
        deadline_passed: "Срок истек",
        open: "Открыто",
        closed: "Закрыто",
        test_period: "Тестовые испытания",
        application_deadline: "Срок подачи заявок",
        key_requirements: "Ключевые требования",
        view_details: "Подробности",
        more: "еще",
        search_departments: "Поиск отделов",
        search_placeholder: "Введите название отдела...",
        no_departments_found: "Отделы не найдены",
        clear_search: "Очистить",
        vacancy: {
          location: "Местоположение",
          type: "Тип работы",
          deadline: "Срок",
          salary: "Зарплата",
          description: "Описание",
          requirements: "Требования",
          responsibilities: "Обязанности",
          benefits: "Преимущества",
          full_time: "Полный рабочий день",
          part_time: "Неполный рабочий день",
          contract: "Контракт",
          internship: "Стажировка",
        },
        vacancy_detail: {
          error_loading_title: "Ошибка загрузки вакансии",
          vacancy_not_found: "Вакансия не найдена",
          deadline_passed: "Срок истек",
          closed: "Закрыто",
          apply_now: "Подать заявку",
        },
        terms_conditions: {
          back: "Назад",
          title: "Условия и положения",
          video_instructions: "Видео инструкция",
          video_description: "Видео инструкция по процессу подачи заявки",
          video_not_supported: "Ваш браузер не поддерживает видео элемент",
          continue: "Продолжить",
          vacancy_info_missing:
            "Информация о вакансии не найдена. Вернитесь на главную страницу.",
          agreement_text:
            "Я полностью прочитал и принимаю условия, указанные выше.",
          agreement_consent:
            "Согласен на обработку моих персональных данных и хочу продолжить процесс подачи заявки.",
          contact_info:
            "Все ваши вопросы и предложения можно отправить на адрес info@cbu.uz.",
          contract_title: "Соглашение об обработке персональных данных",
          section_1_title: "1. Термины",
          section_2_title: "2. Общие положения",
          section_3_title:
            "3. Перечень персональных и иных данных, которые должны быть переданы Оператору Пользователем",
          section_4_title:
            "4. Цели и правила сбора и использования персональных данных",
          section_5_title: "5. Иные условия",
          contract_content: {
            section_1_intro:
              "В соглашении об обработке персональных данных (далее Соглашение) приведенные термины имеют следующие определения:",
            telegram_bot:
              "Телеграм бот (далее Бот) – это любая программа, предназначенная для людей, которая автоматически выполняет специальные действия через интерфейсы и/или в соответствии с установленным расписанием.",
            operator:
              "Оператор – государственный или городской орган, юридическое или физическое лицо, которое самостоятельно организует обработку персональных данных совместно с другими лицами, а также определяет цели обработки персональных данных и выполняет действия (операции) по обработке персональных данных.",
            user: "Пользователь – любое лицо, заполнившее поля ввода данных Бота (зарегистрированное или выполнившее любые другие действия).",
            personal_data:
              "Персональные данные – данные, введенные пользователем (субъектом персональных данных) в Бот и связанные с ним прямо или косвенно.",
            contract_acceptance:
              "Акцепт Соглашения – договоренности о полном и безоговорочном принятии всех условий путем заполнения полей данными в Боте.",
            section_2_1:
              'Настоящее Соглашение составлено на основе требований Закона Республики Узбекистан от 02.07.2019 года ОРК-547 "О персональных данных" и применяется ко всем персональным данным, которые может обрабатывать Оператор Оператор может получать информацию о пользователе при использовании Бота.',
            section_2_2:
              "Ввод данных пользователем в Бот путем заполнения полей означает безоговорочное согласие пользователя со всеми условиями акцепта Соглашения. В случае несогласия с данными условиями Пользователь не должен использовать Бот.",
            section_2_3:
              'Согласие пользователя на предоставление персональных данных Оператору действует до прекращения деятельности по обработке персональных данных Оператором или до отзыва согласия Оператором или пользователем. Пользователь, принявший Соглашение, подтверждает, что использование Бота осуществляется по его собственной воле, что он действует в своих интересах и согласен на обработку своих персональных данных. Пользователь уведомляется о том, что обработка персональных данных осуществляется на основе Закона Республики Узбекистан от 02.07.2019 года ОРК-547 "О персональных данных".',
            section_3_1:
              "При использовании Бота пользователем Оператору предоставляются следующие Персональные данные:",
            section_3_1_1:
              "Достоверные персональные данные пользователя о себе, введенные при заполнении полей ввода данных в Боте, включая: фамилию, имя, отчество, адрес электронной почты, номер телефона и другие.",
            section_3_1_2:
              "Данные, автоматически передаваемые в службы Бота программным обеспечением, установленным на устройстве в процессе работы, включая IP-адрес, данные, полученные из cookie-файлов, информацию о браузере пользователя (или другой программе, работающей с ним).",
            section_4_1:
              "Оператор обрабатывает персональные данные, необходимые для предоставления услуг Пользователю.",
            section_4_2:
              "Оператор использует персональные данные Пользователя в следующих целях:",
            section_4_2_1: "Идентификация пользователя.",
            section_4_2_2:
              "Предоставление пользователю персонализированных услуг и сервисов Бота.",
            section_4_2_3:
              "Поддержание связи с пользователем через Бот, включая отправку уведомлений, запросов и информации, связанных с использованием, предоставление услуг Бота, а также рассмотрение запросов и заявок.",
            section_5_1:
              "Оператор не несет ответственности перед пользователем за любой ущерб, связанный с отсутствием прибыли, потерей данных или экономии, невозможностью использования Бота или его работы.",
            section_5_2:
              "Все возможные споры, вытекающие из настоящего Соглашения, рассматриваются в соответствии с действующим законодательством Республики Узбекистан.",
            section_5_3:
              "Оператор имеет право вносить изменения в настоящее Соглашение без отправки специального уведомления пользователю. Новая редакция Соглашения вступает в силу с момента объявления.",
            section_5_4:
              "Отзыв согласия на обработку персональных данных может быть осуществлен путем отправки письменного уведомления (написанного от руки и подписанного Пользователем) Оператору.",
          },
        },
        application: {
          title: "Подача заявки",
          personal_info: "Личная информация",
          contact_info: "Контактная информация",
          experience: "Опыт",
          education: "Образование",
          skills: "Навыки",
          cover_letter: "Сопроводительное письмо",
          resume: "Резюме",
          submit: "Отправить заявку",
          success: "Заявка успешно отправлена",
          error: "Произошла ошибка",
          form: {
            title: "Заявка на работу",
            personal_info: "Личная информация",
            full_name: "Введите полное имя",
            full_name_placeholder: "Например: Каландаров Каландар Каландарович",
            birth_date: "Укажите дату рождения",
            phone_number: "Введите номер телефона",
            education: "Образование",
            start_year: "Год начала",
            end_year: "Год окончания",
            select_year: "Выберите год",
            currently_studying: "В настоящее время учусь",
            education_period: "Период обучения",
            education_period_placeholder: "2015-2019",
            institution: "Название учреждения",
            institution_placeholder:
              "Ташкентский государственный экономический университет",
            degree: "Степень",
            degree_placeholder: "магистр",
            specialty: "Специальность",
            specialty_placeholder: "экономика",
            add_education: "Добавить еще образование",
            remove_education: "Удалить",
            work_experience: "Трудовая деятельность",
            work_period: "Период работы",
            work_period_placeholder: "2019-2021",
            currently_working: "В настоящее время работаю",
            company: "Название учреждения",
            company_placeholder: "Центральный банк РУз",
            position: "Должность",
            position_placeholder:
              "ведущий специалист юридического департамента",
            add_work: "Добавить еще опыт работы",
            remove_work: "Удалить",
            language_proficiency: "Уровни владения языками",
            uzbek_language: "Узбекский язык",
            russian_language: "Русский язык",
            english_language: "Английский язык",
            dont_know: "Не знаю",
            beginner: "Начальный",
            intermediate: "Средний",
            advanced: "Продвинутый",
            salary_range: "Диапазон месячной зарплаты",
            salary_range_select: "Выберите диапазон зарплаты",
            salary_range_placeholder: "Выберите",
            salary_5_6: "5млн-6млн",
            salary_6_7: "6млн-7млн",
            salary_7_8: "7млн-8млн",
            salary_8_9: "8млн-9млн",
            salary_9_10: "9млн-10млн",
            salary_10_plus: "свыше 10млн",
            criminal_record: "Законность",
            criminal_record_question:
              "Привлекались ли к уголовной ответственности?",
            additional_info: "Дополнительная информация",
            additional_info_placeholder: "Введите дополнительную информацию...",
            back_button: "Назад",
            submit_button: "ПОДАТЬ",
            success_message: "Заявка успешно подана!",
            error_message: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
            submitting: "Отправляется...",
            department_info: "Отдел: {departmentId} | Вакансия: {vacancyId}",
          },
        },
      },
      test: {
        title: "Профессиональный тест",
        default_test_title: "Общий тест знаний",
        default_test_description:
          "Общий тест знаний по специальности Центрального Банка",
        back_button: "Назад",
        progress: "Прогресс",
        answered: "Отвечено",
        question: "Вопрос",
        next: "Следующий",
        previous: "Предыдущий",
        submit: "Завершить тест",
        submitting: "Отправляется...",
        question_navigator: "Список вопросов",
        error_loading: "Ошибка загрузки",
        vacancy_not_found: "Вакансия не найдена",
        leave_warning:
          "Если вы покинете тест, ваши ответы не сохранятся. Продолжить?",
        unanswered_warning:
          "На {{count}} вопросов не дан ответ. Завершить тест?",
        success_message: "Тест успешно завершен!",
        error_message: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
        security: {
          no_right_click: "Правая кнопка мыши заблокирована!",
          no_devtools: "Инструменты разработчика заблокированы!",
          no_screenshot: "Скриншоты заблокированы!",
          no_copy_paste: "Копирование/вставка заблокированы!",
          no_print: "Печать заблокирована!",
          tab_switch_warning:
            "Предупреждение: Вы переключились на другую вкладку!",
          fullscreen_exit_warning:
            "Предупреждение: Вы вышли из полноэкранного режима!",
          devtools_detected:
            "Обнаружены инструменты разработчика! Пожалуйста, закройте их.",
          page_leave_warning:
            "Тест продолжается! Если вы покинете страницу, все ответы будут потеряны!",
          violation_warning:
            "Предупреждение! Нарушение {{count}}/5. Осталось {{remaining}} попытки!",
          blocked_title: "ОТСТРАНЕНИЕ ОТ ТЕСТА",
          blocked_subtitle: "Центральный Банк Республики Узбекистан",
          blocked_description:
            "Вы совершили множественные нарушения во время прохождения теста. Из-за несоблюдения правил тестирования, ваши результаты аннулированы и возможность повторной сдачи ограничена.",
          blocked_reason_title: "Причина отстранения",
          blocked_reason:
            "Из-за 5-кратного нарушения правил тестирования, ваша тестовая сессия была прекращена и результаты аннулированы.",
          blocked_message: "Вы отстранены от теста! Совершено 5 нарушений.",
          go_home: "Вернуться на главную",
        },
        violation_modal: {
          title: "ОБНАРУЖЕНО НАРУШЕНИЕ",
          official_warning: "Официальное предупреждение",
          violation_type: "Тип нарушения",
          screenshot_detected: "Обнаружена попытка сделать снимок экрана",
          tab_switch_detected: "Обнаружен переход на другую программу или окно",
          page_leave_detected: "Обнаружена попытка покинуть страницу теста",
          current_violations: "Количество нарушений",
          remaining: "Осталось {{count}} попытки",
          warning_message:
            "После 5 нарушений вы будете полностью отстранены от теста и результаты будут аннулированы.",
          understood: "Понятно",
        },
        already_submitted: {
          title: "ТЕСТ УЖЕ СДАН",
          subtitle: "Центральный Банк Республики Узбекистан",
          description:
            "Ваши результаты теста уже зарегистрированы в системе. Повторная сдача одного и того же теста запрещена правилами.",
          previous_result: "Зарегистрированные результаты",
          status: "Статус",
          passed: "ПРОЙДЕН",
          failed: "НЕ ПРОЙДЕН",
        },
        result: {
          passed_title: "Поздравляем! Вы прошли тест",
          failed_title: "К сожалению, вы не прошли тест",
          passed_message: "Вы успешно сдали тест!",
          failed_message: "В следующий раз подготовьтесь лучше.",
          your_score: "Ваш результат",
          correct_answers: "Правильные ответы",
          wrong_answers: "Неправильные ответы",
          time_spent: "Затраченное время",
          minutes: "минут",
          pass_info:
            "Вы дали не менее 50% правильных ответов и успешно прошли тест!",
          fail_info:
            "Для прохождения теста необходимо было дать не менее 50% правильных ответов.",
          go_home: "Вернуться на главную",
        },
        questions: {
          q1: {
            question:
              "Когда был создан Центральный банк Республики Узбекистан?",
            a: "1 сентября 1991 года",
            b: "1 января 1991 года",
            c: "1 января 1992 года",
            d: "1 сентября 1990 года",
          },
          q2: {
            question: "Какова основная задача Центрального банка?",
            a: "Сбор доходов республиканского бюджета",
            b: "Обеспечение стабильности национальной валюты",
            c: "Финансирование предприятий",
            d: "Управление государственным долгом",
          },
          q3: {
            question: "Какая национальная валюта Узбекистана?",
            a: "Рубль",
            b: "Доллар",
            c: "Сум",
            d: "Тенге",
          },
          q4: {
            question: "Какова основная задача отдела кадров?",
            a: "Подготовка финансовых отчетов",
            b: "Подбор и развитие сотрудников",
            c: "Проведение маркетинговых исследований",
            d: "Техническое обеспечение",
          },
          q5: {
            question: "Одно из основных качеств банковских служащих?",
            a: "Ответственность и честность",
            b: "Громко говорить",
            c: "Быстро ходить",
            d: "Много спать",
          },
          q6: {
            question: "Как следует одеваться в государственных организациях?",
            a: "В спортивной одежде",
            b: "В официальном деловом стиле",
            c: "В свободной одежде",
            d: "В национальной одежде",
          },
          q7: {
            question: "Какому органу подотчетен Центральный банк?",
            a: "Кабинету Министров",
            b: "Президенту",
            c: "Олий Мажлису",
            d: "Никому",
          },
          q8: {
            question: "Каково основное право банковского работника?",
            a: "Не приходить на работу в любое время",
            b: "Соблюдение условий трудового договора",
            c: "Вмешательство в дела других",
            d: "Невыполнение приказов",
          },
          q9: {
            question: "Как следует хранить документы?",
            a: "Дома",
            b: "На улице",
            c: "В конфиденциальном месте упорядоченно",
            d: "Открыто на компьютерном столе",
          },
          q10: {
            question: "Одно из правил общения с клиентом:",
            a: "Грубое обращение",
            b: "Вежливость и уважение",
            c: "Игнорирование",
            d: "Говорить громко",
          },
        },
      },
      not_found: {
        title: "Страница не найдена",
        description:
          "Страница, которую вы ищете, не существует. Давайте вернем вас обратно!",
        go_back: "Вернуться назад",
        back_to_home: "На главную",
      },
    },
  },
};

const allowedLanguages = ["uz-Latn", "uz-Cyrl", "ru"];
const saved =
  typeof window !== "undefined" ? localStorage.getItem("language") : null;
const initialLng = allowedLanguages?.includes(saved) ? saved : "uz-Latn";

// Ensure localStorage has a valid language
if (typeof window !== "undefined") {
  if (!saved || !allowedLanguages?.includes(saved)) {
    try {
      localStorage.setItem("language", "uz-Latn");
    } catch {}
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "uz-Latn",
  interpolation: { escapeValue: false },
  returnNull: false,
  debug: false,
  react: {
    useSuspense: false,
  },
});

// Ensure the language is properly set
if (typeof window !== "undefined") {
  i18n
    .changeLanguage(initialLng)
    .then(() => {})
    .catch((error) => {
      console.error("i18n initialization error:", error);
    });
}

export default i18n;
