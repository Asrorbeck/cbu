import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import DepartmentDetails from "../job-vacancies-browser/components/DepartmentDetails";
import VacancyCard from "../job-vacancies-browser/components/VacancyCard";
import JobDetailModal from "../job-vacancies-browser/components/JobDetailModal";
import LoadingSkeleton from "../job-vacancies-browser/components/LoadingSkeleton";
import Icon from "../../components/AppIcon";

const DepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock departments data
  const departments = {
    "information-technology": {
      id: "information-technology",
      name: t("jobs.departments.information_technology.name"),
      description: t("jobs.departments.information_technology.description"),
      openings: 1,
    },
  };

  // Mock vacancies data
  const vacanciesByDepartment = {
    "information-technology": [
      {
        id: "it-004",
        title: "Yetakchi mutahassis",
        department: t("jobs.departments.information_technology.name"),
        location: "Markaziy apparat",
        type: "Full-time",
        deadline: "2025-11-25",
        testDeadline: "2025-12-01",
        salary: "15,000,000 - 22,000,000 UZS",
        description:
          "Интеграция ва маълумотларни шакллантириш бошқармаси етакчи мутахассиси",
        fullDescription: `Интеграция ва маълумотларни шакллантириш бошқармаси етакчи мутахассиси лавозими учун ишчи кучи изламоқдамиз. Ушбу лавозимга мурожаат қилган номзод интеграцион ечимларни лойиҳалаш ва ишлаб чиқиш соҳасида тажрибага эга бўлиши керак.\n\nБу лавозим замонавий интеграцион технологиялар билан ишлаш ва банкнинг рақамли трансформациясига ҳисса қўшиш учун ажойиб имконият тақдим этади.`,
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
    ],
    finance: [
      {
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
    ],
    hr: [
      {
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
    ],
    risk: [
      {
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
    ],
  };

  const department = departments[departmentId];
  const vacancies = vacanciesByDepartment[departmentId] || [];

  const handleVacancySelect = (vacancy) => {
    setSelectedVacancy(vacancy);
    setShowJobModal(true);
  };

  const handleCloseModal = () => {
    setShowJobModal(false);
    setSelectedVacancy(null);
  };

  if (!department) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Icon
                name="AlertCircle"
                size={48}
                className="text-muted-foreground mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("jobs.department_not_found")}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t("jobs.department_not_found_desc")}
              </p>
              <button
                onClick={() => navigate("/departments")}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("jobs.back_to_departments")}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/departments")}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>{t("jobs.back_to_departments")}</span>
            </button>
          </div>

          {/* Department Details */}
          <DepartmentDetails department={department} />

          {/* Vacancies Section */}
          <div className="space-y-6 pb-20">
            <h2 className="text-2xl font-bold text-foreground">
              {t("jobs.available_positions")} ({vacancies.length})
            </h2>

            {loading ? (
              <LoadingSkeleton type="vacancies" count={4} />
            ) : vacancies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vacancies.map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    onSelect={handleVacancySelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon
                  name="Briefcase"
                  size={48}
                  className="text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("jobs.no_vacancies_available")}
                </h3>
                <p className="text-muted-foreground">
                  {t("jobs.no_vacancies_available_desc")}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Job Detail Modal */}
      {showJobModal && selectedVacancy && (
        <JobDetailModal vacancy={selectedVacancy} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default DepartmentPage;
