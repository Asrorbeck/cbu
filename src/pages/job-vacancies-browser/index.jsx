import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Navbar from "../../components/ui/Navbar";
import DepartmentCard from "./components/DepartmentCard";
import DepartmentDetails from "./components/DepartmentDetails";
import VacancyCard from "./components/VacancyCard";
import JobDetailModal from "./components/JobDetailModal";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { departmentsAPI } from "../../services/api";

const JobVacanciesBrowser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1); // 1: branch type selection, 2: departments, 3: vacancies, 4: details
  const [selectedBranchType, setSelectedBranchType] = useState(null); // "central" or "regional"
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Check URL query params on mount to restore state
  useEffect(() => {
    const branchType = searchParams.get("branchType");
    if (branchType === "central") {
      setSelectedBranchType("central");
      setCurrentStep(2);
    }
  }, [searchParams]);

  // Branch type cards data
  const branchTypeCards = [
    {
      id: "central",
      title: "Markaziy apparat",
      description: "Markaziy apparat bo'limlari va vakansiyalari",
      icon: "Building2",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "regional",
      title: "Hududiy bosh boshqarmalar",
      description: "Hududiy boshqarmalar bo'limlari va vakansiyalari",
      icon: "MapPin",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  // Helper function to get language suffix for API fields
  const getLanguageSuffix = (language) => {
    if (language === "uz-Latn") return "uz";
    if (language === "uz-Cyrl") return "cr";
    if (language === "ru") return "ru";
    return "uz"; // default fallback
  };

  // Fetch departments from API when branch type is selected
  useEffect(() => {
    if (!selectedBranchType) return;

    const fetchDepartments = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const response = await departmentsAPI.getDepartments();
        // Handle paginated response structure: { count, next, previous, results: [...] }
        const departmentsData = response.results || response;
        // Ensure it's an array
        const departmentsArray = Array.isArray(departmentsData) 
          ? departmentsData 
          : [];
        
        // Get current language suffix
        const currentLanguage = i18n.language || localStorage.getItem("language") || "uz-Latn";
        const langSuffix = getLanguageSuffix(currentLanguage);
        
        // Transform API data to match component structure
        const transformedDepartments = departmentsArray.map((dept) => {
          // Get name based on current language
          const nameField = `name_${langSuffix}`;
          const tasksField = `department_tasks_${langSuffix}`;
          
          const name = dept[nameField] || dept.name_uz || dept.name_cr || dept.name_ru || "";
          const departmentTasks = dept[tasksField] || dept.department_tasks_uz || dept.department_tasks_cr || dept.department_tasks_ru || [];
          
          // Ensure department_tasks is an array of objects with 'task' property
          const formattedTasks = Array.isArray(departmentTasks) 
            ? departmentTasks.map(task => typeof task === 'string' ? { task } : task)
            : [];
          
          return {
            id: dept.id.toString(),
            name: name,
            description: "", // Add description field if needed in future
            icon: "Monitor", // Default icon, can be customized based on department
            color: "text-warning",
            bgColor: "bg-warning/10",
            openings: dept.active_vacancies_count || 0,
            department_tasks: formattedTasks,
          };
        });
        setDepartments(transformedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setApiError("Failed to load departments. Please try again later.");
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [selectedBranchType, i18n.language]);

  // Filter departments based on search query
  const filteredDepartments = departments.filter((dept) =>
    dept?.name && dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock vacancies data
  const vacanciesByDepartment = {
    "information-technology": [
      {
        id: "it-001",
        title: "Senior Software Developer",
        department: "Information Technology",
        location: "Tashkent, Uzbekistan",
        type: "Full-time",
        deadline: "2025-02-10",
        salary: "16,000,000 - 22,000,000 UZS",
        description:
          "Develop and maintain banking software systems, ensuring security and reliability of IT infrastructure.",
        fullDescription: `We are seeking a highly qualified Senior Software Developer to join our Information Technology Department. The successful candidate will play a crucial role in developing and maintaining banking software systems, ensuring security and reliability of our IT infrastructure.\n\nThis position offers an excellent opportunity to contribute to Uzbekistan's digital banking transformation and work with cutting-edge technologies.`,
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
      {
        id: "it-002",
        title: "Cybersecurity Specialist",
        department: "Information Technology",
        location: "Tashkent, Uzbekistan",
        type: "Full-time",
        deadline: "2025-02-20",
        salary: "18,000,000 - 25,000,000 UZS",
        description:
          "Protect banking systems from cyber threats and ensure compliance with security standards.",
        fullDescription: `We are looking for an experienced Cybersecurity Specialist to join our Information Technology Department. The successful candidate will be responsible for protecting our banking systems from cyber threats and ensuring compliance with security standards.\n\nThis role offers the opportunity to work with state-of-the-art security technologies and contribute to the bank's cybersecurity strategy.`,
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
      {
        id: "it-003",
        title: "Database Administrator",
        department: "Information Technology",
        location: "Tashkent, Uzbekistan",
        type: "Full-time",
        deadline: "2025-02-25",
        salary: "14,000,000 - 20,000,000 UZS",
        description:
          "Manage and maintain database systems to ensure optimal performance and security.",
        fullDescription: `We are seeking a skilled Database Administrator to join our Information Technology Department. The successful candidate will be responsible for managing and maintaining our database systems to ensure optimal performance and security.\n\nThis position offers the opportunity to work with large-scale database systems and contribute to the bank's data management strategy.`,
        requirements: [
          "Bachelor's degree in Computer Science or IT",
          "Minimum 3 years of database administration experience",
          "Proficiency in SQL Server, Oracle, or PostgreSQL",
          "Knowledge of database security and backup procedures",
          "Experience with cloud databases",
          "Strong troubleshooting skills",
        ],
        responsibilities: [
          "Install and configure database systems",
          "Monitor database performance and optimize queries",
          "Implement backup and recovery procedures",
          "Ensure database security and compliance",
          "Troubleshoot database issues",
          "Plan and execute database migrations",
        ],
      },
      {
        id: "it-003",
        title: "Boshqarma boshligi orinbosari",
        department: "Information Technology",
        location: "Markaziy apparat",
        type: "Full-time",
        deadline: "2025-02-28",
        salary: "20,000,000 - 30,000,000 UZS",
        description:
          "Интеграция ва маълумотларни шакллантириш бошқармаси бошлиғи ўринбосари",
        fullDescription: `Интеграция ва маълумотларни шакллантириш бошқармаси бошлиғи ўринбосари лавозими учун ишчи кучи изламоқдамиз. Ушбу лавозимга мурожаат қилган номзод интеграцион ечимларни лойиҳалаш, ишлаб чиқиш ва жорий этиш соҳасида кенг тажрибага эга бўлиши керак.\n\nБу лавозим Узбекистоннинг рақамли банк трансформациясига ҳисса қўшиш ва замонавий технологиялар билан ишлаш учун ажойиб имконият тақдим этади.`,
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
      {
        id: "it-004",
        title: "Yetakchi mutahassis",
        department: "Information Technology",
        location: "Markaziy apparat",
        type: "Full-time",
        deadline: "2025-02-25",
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
  };

  const handleBranchTypeSelect = (branchType) => {
    if (branchType === "central") {
      // For central, fetch departments and show them
      setSelectedBranchType(branchType);
      setCurrentStep(2);
    } else if (branchType === "regional") {
      // For regional, navigate to /region page
      navigate("/region");
    }
  };

  const handleDepartmentSelect = (department) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedDepartment(department);
      setCurrentStep(3);
      setLoading(false);
    }, 800);
  };

  const handleVacancySelect = (vacancy) => {
    setSelectedVacancy(vacancy);
    setShowJobModal(true);
  };

  const handleBreadcrumbNavigate = (step) => {
    if (step === 1) {
      setCurrentStep(1);
      setSelectedBranchType(null);
      setSelectedDepartment(null);
      setSelectedVacancy(null);
    } else if (step === 2 && selectedBranchType) {
      setCurrentStep(2);
      setSelectedDepartment(null);
      setSelectedVacancy(null);
    } else if (step === 3 && selectedDepartment) {
      setCurrentStep(3);
      setSelectedVacancy(null);
    }
  };

  const getCurrentVacancies = () => {
    if (!selectedDepartment) return [];
    return vacanciesByDepartment?.[selectedDepartment?.id] || [];
  };

  const renderBranchTypeSelection = () => (
    <div className="space-y-6">
      {/* Branch Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branchTypeCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleBranchTypeSelect(card.id)}
            className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 border border-gray-200 dark:border-slate-700"
          >
            {/* Icon in top-right corner */}
            <div
              className={`absolute top-4 right-4 w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity duration-300`}
            >
              <Icon name={card.icon} size={20} className={card.color} />
            </div>

            {/* Content */}
            <div className="space-y-3 pr-16">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Action */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                <span className="text-sm font-medium">{t("jobs.view_details")}</span>
                <Icon
                  name="ArrowRight"
                  size={16}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  const renderDepartments = () => (
    <div className="space-y-6">
      {/* Error Message */}
      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <Icon
              name="AlertCircle"
              size={20}
              className="text-red-600 dark:text-red-400 mr-3"
            />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading departments
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {apiError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => handleBreadcrumbNavigate(1)}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Orqaga
        </Button>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("jobs.search_departments")}
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {t("jobs.clear_search")}
              </button>
            )}
          </div>
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={t("jobs.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <LoadingSkeleton type="cards" count={6} />
      ) : filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments?.map((department) => (
            <DepartmentCard key={department?.id} department={department} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon
            name="Search"
            size={48}
            className="text-gray-400 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t("jobs.no_departments_found")}
          </h3>
          
        </div>
      )}
    </div>
  );

  const renderVacancies = () => {
    const vacancies = getCurrentVacancies();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {selectedDepartment?.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {vacancies?.length} {t("jobs.vacancies_title").toLowerCase()}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => handleBreadcrumbNavigate(1)}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            {t("jobs.back_to_departments")}
          </Button>
        </div>

        {/* Department Details */}
        <DepartmentDetails department={selectedDepartment} />
        {loading ? (
          <LoadingSkeleton type="vacancies" count={4} />
        ) : vacancies?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vacancies?.map((vacancy) => (
              <VacancyCard
                key={vacancy?.id}
                vacancy={vacancy}
                onSelect={handleVacancySelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon
              name="Briefcase"
              size={64}
              className="mx-auto text-muted-foreground mb-4"
            />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("jobs.no_vacancies")}
            </h3>
            <p className="text-muted-foreground">
              {t("jobs.no_vacancies_desc")}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {t("jobs.title")}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {t("jobs.subtitle")}
            </p>
          </div>


          {/* Content */}
          {currentStep === 1 && renderBranchTypeSelection()}
          {currentStep === 2 && selectedBranchType === "central" && renderDepartments()}
          {currentStep === 3 && renderVacancies()}
        </div>
      </main>
      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        vacancy={selectedVacancy}
      />
      {/* Bottom navigation spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default JobVacanciesBrowser;
