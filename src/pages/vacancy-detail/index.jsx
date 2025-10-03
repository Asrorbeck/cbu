import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";

const VacancyDetailPage = () => {
  const { departmentId, vacancyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // All vacancies data
  const allVacancies = {
    "it-001": {
      id: "it-001",
      title: "Senior Software Developer",
      department: "Axborot Texnologiyalari Departamenti",
      location: "Markaziy apparat",
      type: "Full-time",
      deadline: "2025-02-10",
      testDeadline: "2025-02-15",
      salary: "16,000,000 - 22,000,000 UZS",
      description:
        "Develop and maintain banking software systems, ensuring security and reliability of IT infrastructure.",
      fullDescription: `We are seeking a highly qualified Senior Software Developer to join our Information Technology Department. The successful candidate will play a crucial role in developing and maintaining banking software systems, ensuring security and reliability of our IT infrastructure.

This position offers an excellent opportunity to contribute to Uzbekistan's digital banking transformation and work with cutting-edge technologies.`,
      requirements: [
        "Bachelor's degree in Computer Science or IT",
        "Minimum 5 years of software development experience",
        "Proficiency in Java, Python, or C#",
        "Experience with database management systems",
        "Knowledge of cybersecurity best practices",
        "Experience with cloud platforms (AWS, Azure, or GCP)",
      ],
      responsibilities: [
        "Design and develop banking applications",
        "Maintain and optimize existing systems",
        "Implement security measures and protocols",
        "Collaborate with cross-functional teams",
        "Code review and mentoring junior developers",
        "Participate in system architecture decisions",
      ],
    },
    "it-002": {
      id: "it-002",
      title: "Cybersecurity Specialist",
      department: "Axborot Texnologiyalari Departamenti",
      location: "Toshkent viloyati",
      type: "Full-time",
      deadline: "2025-01-15",
      testDeadline: "2025-01-20",
      salary: "18,000,000 - 25,000,000 UZS",
      description:
        "Protect banking systems from cyber threats and ensure compliance with security standards.",
      fullDescription: `We are looking for an experienced Cybersecurity Specialist to join our Information Technology Department. The successful candidate will be responsible for protecting our banking systems from cyber threats and ensuring compliance with security standards.

This role offers the opportunity to work with state-of-the-art security technologies and contribute to the bank's cybersecurity strategy.`,
      requirements: [
        "Bachelor's degree in Cybersecurity, Computer Science, or related field",
        "Minimum 4 years of cybersecurity experience",
        "Certifications: CISSP, CISM, or CEH preferred",
        "Knowledge of banking security regulations",
        "Experience with security tools and technologies",
        "Strong analytical and problem-solving skills",
      ],
      responsibilities: [
        "Monitor and analyze security threats",
        "Implement security policies and procedures",
        "Conduct security assessments and audits",
        "Respond to security incidents",
        "Train staff on security best practices",
        "Maintain security documentation",
      ],
    },
    "it-003": {
      id: "it-003",
      title: "Boshqarma boshligi orinbosari",
      department: "Axborot Texnologiyalari Departamenti",
      location: "Markaziy apparat",
      type: "Full-time",
      deadline: "2025-02-28",
      testDeadline: "2025-03-05",
      salary: "20,000,000 - 30,000,000 UZS",
      description:
        "Интеграция ва маълумотларни шакллантириш бошқармаси бошлиғи ўринбосари",
      fullDescription: `Интеграция ва маълумотларни шакллантириш бошқармаси бошлиғи ўринбосари лавозими учун ишчи кучи изламоқдамиз. Ушбу лавозимга мурожаат қилган номзод интеграцион ечимларни лойиҳалаш, ишлаб чиқиш ва жорий этиш соҳасида кенг тажрибага эга бўлиши керак.

Бу лавозим Узбекистоннинг рақамли банк трансформациясига ҳисса қўшиш ва замонавий технологиялар билан ишлаш учун ажойиб имконият тақдим этади.`,
      requirements: [
        "Маълумоти: ахборот технологиялари, дастурий инжиниринг, амалий математика ва информатика, иқтисодиётда ахборот тизимлари ёки рақамли иқтисодиёт йўналишлари бўйича бакалавр даражаси",
        "Иш тажрибаси: тегишли сохада камида 5 йиллик иш тажрибаси талаб этилади",
        "Хорижий тилларни билиш даражаси: инглиз(B1) ва рус тили(B2) даражада талаб этилади",
        "MS Office дастурларида бемалол ишлай олиши лозим",
        "Python ва/ёки Java дастурлаш тилларида асосий кўникмаларга эга бўлиши",
        "Маълумотлар билан ишлаш учун асосий ва мураккаб SQL сўровларини ёзиш қобилияти",
        "Техник топшириқлар, тавсифлар ва йўриқномаларни Миллий стандартлар (O'z DSt) асосида ёза олиши лозим",
        "Маълумотларни таҳлил қилиш ва тегишли таҳлилий инструментлардан фойдаланиш бўйича амалий тажрибага эга бўлиши",
        "Сунъий интеллект (AI) технологияларининг асосий тамойилларини тушуниши ва хизмат фаолиятида улларни қўллаш кўникмасига эга бўлиши лозим",
      ],
      responsibilities: [
        "Ички ва ташқи ахборот тизимлари ўртасидаги интеграцион ечимларни лойиҳалаш, ишлаб чиқиш ва жорий этиш ва назорат қилиб бориш",
        "Интеграцион ечимлар бўйича технологик йўриқнома, техник паспорт, фойдаланувчи қўлланмаси ва тест сценарийларини ишлаб чиқиш ва назорат қилиб бориш",
        "Маълумотлар структуралари ва форматлари билан мустақил ишлаш (JSON, XML, CSV каби умумий форматлар)",
        "Мураккаб API ларни ишлаб чиқиш, шунингдек, иш жараёнларини автоматлаштириш ва маълумотларни қайта ишлаш билан боғлиқ лойиҳаларни ишлаб чиқиш ва назорат қилиш",
        "Ички хизмат ҳужжатлари ва меъёрий-ҳуқуқий ҳужжатлар билан ишлаш, уларни таҳлил қилиш, расмийлаштириш ва назорат қилиш",
        "Интеграция ва маълумотлар алмашинуви соҳасига оид амалдаги норматив-ҳуқуқий ҳужжатларни тизимли ўрганиш ва такомиллаштириш бўйича таклифлар ишлаб чиқиш",
      ],
    },
    "it-004": {
      id: "it-004",
      title: "Yetakchi mutahassis",
      department: "Axborot Texnologiyalari Departamenti",
      location: "Markaziy apparat",
      type: "Full-time",
      deadline: "2025-11-25",
      testDeadline: "2025-12-01",
      salary: "15,000,000 - 22,000,000 UZS",
      description:
        "Интеграция ва маълумотларни шакллантириш бошқармаси етакчи мутахассиси",
      fullDescription: `Интеграция ва маълумотларни шакллантириш бошқармаси етакчи мутахассиси лавозими учун ишчи кучи изламоқдамиз. Ушбу лавозимга мурожаат қилган номзод интеграцион ечимларни лойиҳалаш ва ишлаб чиқиш соҳасида тажрибага эга бўлиши керак.

Бу лавозим замонавий интеграцион технологиялар билан ишлаш ва банкнинг рақамли трансформациясига ҳисса қўшиш учун ажойиб имконият тақдим этади.`,
      requirements: [
        "Маълумоти: Ахборот технологиялари, дастурий инжиниринг, амалий математика ва информатика, иқтисодиётда ахборот тизимлари ёки рақамли иқтисодиёт йўналишлари бўйича бакалавр даражаси",
        "Иш тажрибаси: тегишли сохада камида 1 йиллик иш тажрибаси талаб этилади",
        "Хорижий тилларни билиш даражаси: инглиз(B1) ва рус тили(B1) даражада талаб этилади",
        "MS Office дастурларида бемалол ишлай олиши лозим",
        "Python ва(ёки) Java дастурлаш тилида асосий кўникмаларга эга бўлиши",
        "Маълумотлар билан ишлаш учун асосий ва ўрта мураккабликдаги SQL сўровларини ёзиш қобилияти",
        "Техник топшириқлар, тавсифлар, йўриқномалар ёза олиши ва Миллий стандартларни (O'z DSt) билиши талаб этилади",
        "Маълумотларни таҳлил қилиш ва тегишли таҳлилий инструментлардан фойдаланиши бўйича амалий кўникмага эга бўлиши лозим",
        "Сунъий интеллект (AI) технологияларининг асосий тамойилларини тушуниши ва хизмат фаолиятида уларни қўллаш кўникмасига эга бўлиши лозим",
      ],
      responsibilities: [
        "Ички ва ташқи ахборот тизимлари ўртасидаги интеграцион ечимларни лойиҳалаш, ишлаб чиқиш ва жорий этишда иштирок этиш",
        "Интеграцион ечимлар бўйича технологик йўриқнома, техник паспорт, фойдаланувчи қўлланмаси ва тест сценарийларини ишлаб чиқиш",
        "Маълумотлар структуралари ва форматлари билан ишлаш (JSON, XML, CSV каби умумий форматлар)",
        "API ишлаб чиқиш учун (Flask/FastAPI/Django REST Framework каби фреймворклардан фойдаланган ҳолда), автоматлаштириш учун скриптлар ёзиш",
        "Ички хизмат ҳужжатлари ва меъёрий-ҳуқуқий ҳужжатлар билан ишлаш, уларни белгиланган тартибда шакллантириш, мувофиқлаштириш ва юритиш",
        "Интеграцион лойиҳаларни техник жиҳатдан қўллаб-қувватлаш ва назорат қилиш",
      ],
    },
    "fin-001": {
      id: "fin-001",
      title: "Senior Financial Analyst",
      department: "Moliyaviy boshqaruv departamenti",
      location: "Toshkent viloyati",
      type: "Full-time",
      deadline: "2025-02-20",
      testDeadline: "2025-02-25",
      salary: "14,000,000 - 20,000,000 UZS",
      description: "Financial analysis and reporting for banking operations.",
      fullDescription:
        "We are looking for an experienced Financial Analyst to join our Finance Department.",
      requirements: [
        "Bachelor's degree in Finance or Economics",
        "Minimum 3 years of financial analysis experience",
        "Proficiency in Excel and financial modeling",
        "Knowledge of banking regulations",
      ],
      responsibilities: [
        "Prepare financial reports",
        "Analyze market trends",
        "Support budget planning",
      ],
    },
    "hr-001": {
      id: "hr-001",
      title: "HR Specialist",
      department: "Kadrlar departamenti",
      location: "Markaziy apparat",
      type: "Full-time",
      deadline: "2025-02-15",
      testDeadline: "2025-02-20",
      salary: "12,000,000 - 18,000,000 UZS",
      description: "Human resources management and employee relations.",
      fullDescription:
        "We are seeking an HR Specialist to join our Human Resources Department.",
      requirements: [
        "Bachelor's degree in HR or related field",
        "Minimum 2 years of HR experience",
        "Knowledge of labor laws",
        "Strong communication skills",
      ],
      responsibilities: [
        "Recruit and onboard employees",
        "Manage employee records",
        "Handle employee relations",
      ],
    },
    "risk-001": {
      id: "risk-001",
      title: "Risk Analyst",
      department: "Risk boshqaruvi departamenti",
      location: "Markaziy apparat",
      type: "Full-time",
      deadline: "2025-02-25",
      testDeadline: "2025-03-01",
      salary: "15,000,000 - 22,000,000 UZS",
      description: "Risk assessment and management for banking operations.",
      fullDescription:
        "We are looking for a Risk Analyst to join our Risk Management Department.",
      requirements: [
        "Bachelor's degree in Finance or Risk Management",
        "Minimum 3 years of risk analysis experience",
        "Knowledge of banking risk frameworks",
        "Strong analytical skills",
      ],
      responsibilities: [
        "Assess credit and operational risks",
        "Develop risk management strategies",
        "Monitor risk indicators",
      ],
    },
  };

  // Get the specific vacancy based on vacancyId
  const vacancy = allVacancies[vacancyId] || allVacancies["it-001"];

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isDeadlinePassed = () => {
    if (!vacancy?.deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(vacancy.deadline);
    // Set time to end of day for deadline comparison
    deadlineDate.setHours(23, 59, 59, 999);
    return today > deadlineDate;
  };

  const daysRemaining = getDaysRemaining(vacancy?.deadline);
  const isVacancyClosed = isDeadlinePassed();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() =>
                navigate(
                  departmentId ? `/departments/${departmentId}` : "/departments"
                )
              }
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>{t("jobs.back_to_departments")}</span>
            </button>
          </div>

          {/* Vacancy Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 px-6 py-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {vacancy?.title}
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 text-lg font-medium mb-4">
                    {vacancy?.department}
                  </p>
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={18} />
                      <span>{vacancy?.location}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isVacancyClosed
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {isVacancyClosed ? "Muddat o'tgan" : t("jobs.open")}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-8">
              {/* Deadlines */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("jobs.application_deadline")} & {t("jobs.test_period")}
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Icon
                      name="Calendar"
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {t("jobs.application_deadline")}
                      </span>
                      <span className="text-base font-semibold text-blue-800 dark:text-blue-200">
                        {formatDeadline(vacancy?.deadline)}
                      </span>
                    </div>
                  </div>
                  {vacancy?.testDeadline && (
                    <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
                      <Icon
                        name="Clipboard"
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {t("jobs.test_period")}
                        </span>
                        <span className="text-base font-semibold text-green-800 dark:text-green-200">
                          {formatDeadline(vacancy?.testDeadline)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t("jobs.vacancy.description")}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {vacancy?.fullDescription}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t("jobs.vacancy.requirements")}
                </h2>
                <ul className="space-y-2">
                  {vacancy?.requirements?.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                    >
                      <Icon
                        name="CheckCircle"
                        size={20}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t("jobs.vacancy.responsibilities")}
                </h2>
                <ul className="space-y-2">
                  {vacancy?.responsibilities?.map((resp, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                    >
                      <Icon
                        name="CheckCircle"
                        size={20}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    if (!isVacancyClosed) {
                      navigate(
                        `/departments/${departmentId}/${vacancyId}/terms-and-conditions`,
                        {
                          state: { vacancyInfo: vacancy },
                        }
                      );
                    }
                  }}
                  disabled={isVacancyClosed}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${
                    isVacancyClosed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isVacancyClosed ? "Yopiq" : "Ariza topshirish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VacancyDetailPage;
