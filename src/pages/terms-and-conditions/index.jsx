import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";

const TermsAndConditionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { departmentId, vacancyId } = useParams();
  const { t } = useTranslation();
  const [isAgreed, setIsAgreed] = useState(false);

  // Decode the vacancy ID from URL
  const decodedVacancyId = vacancyId ? atob(vacancyId) : null;

  // Get vacancy info from location state or URL params
  const vacancyInfo = location.state?.vacancyInfo || {
    departmentId,
    vacancyId: decodedVacancyId,
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAgreementChange = (e) => {
    setIsAgreed(e.target.checked);
  };

  const handleContinue = () => {
    if (isAgreed) {
      // Navigate to job application form
      if (departmentId && vacancyId) {
        navigate(`/departments/${departmentId}/${vacancyId}/form`, {
          state: { vacancyInfo },
        });
      } else {
        // Fallback if no vacancy info is available
        alert("Вакансия маълумотлари топилмади. Бош саҳифага қайтинг.");
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Orqaga</span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 px-4 sm:px-6 py-6 sm:py-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white  leading-tight">
                Shartnoma va Yo'riqnomalar
              </h1>
              {vacancyInfo?.title && (
                <p className="text-blue-600 dark:text-blue-400 text-lg font-medium mt-2">
                  {vacancyInfo.title}
                </p>
              )}
            </div>

            {/* Content Section */}
            <div className="mt-3 space-y-8">
              {/* Video Section */}
              <div className="px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Video Ko'rsatma
                </h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg pb-4 text-center">
                  <video
                    className="w-full max-w-2xl mx-auto rounded-lg"
                    controls
                    poster="/assets/images/video-poster.jpg"
                  >
                    <source src="/src/video/video.mp4" type="video/mp4" />
                    <source src="/src/video/video.webm" type="video/webm" />
                    Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
                  </video>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-4 px-4">
                    Ariza topshirish jarayoni haqida video ko'rsatma
                  </p>
                </div>
              </div>

              {/* Contract Text */}
              <div className="px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Шахсга доир маълумотларга ишлов бериш бўйича шартнома
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-h-96 overflow-y-auto">
                  <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">1. Атамалар</h3>
                      <p className="mb-2">
                        Шахсга доир маълумотларга ишлов бериш тўғрисидаги
                        шартномада (кейинги ўринларда Шартнома) келтирилган
                        атамалар қуйидаги таърифларга эга:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          <strong>Телеграм бот</strong> (кейинги ўринларда Бот)
                          – бу одамлар учун мўлжалланиб, интерфейслар орқали
                          автоматик равишда махсус дастур ва / ёки белгиланган
                          жадвалга мувофиқ, амалга ошириладиган ҳар қандай
                          ҳаракатлар.
                        </li>
                        <li>
                          <strong>Оператор</strong> – мустақил равишда бошқа
                          шахслар билан биргаликда шахсий маълумотларни қайта
                          ишлашни ташкил этадиган, шунингдек шахсий
                          маълумотларни қайта ишлаш мақсадларини аниқлайдиган,
                          шахсий маълумотлар таркибига ишлов берадиган
                          ҳаракатлар (операциялар)ни амалга оширувчи давлат ёки
                          шаҳар идораси, юридик ёки жисмоний шахс.
                        </li>
                        <li>
                          <strong>Фойдаланувчи</strong> – Ботнинг маълумотлар
                          киритиш майдонларини тўлдирган ҳар қандай шахс
                          (рўйхатдан ўтган ёки бошқа ҳар қандай ҳаракатларни
                          амалга оширган).
                        </li>
                        <li>
                          <strong>Шахсий маълумотлар</strong> – Ботга
                          фойдаланувчи (шахсий маълумотлар эгаси) томонидан
                          киритилган ва унга бевосита ёки билвосита алоқадор
                          бўлган маълумотлар.
                        </li>
                        <li>
                          <strong>Шартнома акцепти</strong> – Ботдаги
                          майдонларни маълумотлар киритиб тўлдириш орқали барча
                          шартларни тўлиқ ва сўзсиз қабул қилиш бўйича
                          келишувлар.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">2. Умумий қоидалар</h3>
                      <p className="mb-2">
                        2.1. Ушбу Шартнома Ўзбекистон Республикасининг
                        02.07.2019 йилдаги ЎРҚ-547-сонли "Шахсга доир
                        маълумотлар тўғрисида" Қонуни талаблари асосида тузилган
                        ва Оператор бажариши мумкин бўлган барча шахсий
                        маълумотларга нисбатан қўлланилади Оператор Ботдан
                        фойдаланишда фойдаланувчи ҳақида маълумотларни олиши
                        мумкин.
                      </p>
                      <p className="mb-2">
                        2.2. Ботга фойдаланувчи томонидан майдонларни тўлдириш
                        орқали маълумотларни киритиш Шартнома акцептининг барча
                        шартлари билан фойдаланувчининг сўзсиз розилигини
                        англатади. Ушбу шартларга рози бўлмаган тақдирда
                        Фойдаланувчи Ботдан фойдаланмаслиги лозим.
                      </p>
                      <p className="mb-2">
                        2.3. Операторга шахсий маълумотларни тақдим этишга
                        фойдаланувчининг розилиги уларни Оператор томонидан
                        қайта ишлаш фаолияти тугатилгунига ёки Оператор ёки
                        фойдаланувчи розилигини қайтариб олгунига қадар амал
                        қилади. Шартномани қабул қилган фойдаланувчи Ботдан
                        фойдаланиш ўз хоҳиши билан амалга оширганини, бу унинг
                        манфаати учун ҳаракат қилишини ва шахсий маълумотларини
                        қайта ишлашга рози бўлганини тасдиқлайди. Шахсий
                        маълумотларни қайта ишлаш Ўзбекистон Республикасининг
                        02.07.2019 йилдаги ЎРҚ-547-сон "Шахсий маълумотлар
                        тўғрисида"ги қонуни асосида амалга оширилиши тўғрисида
                        фойдаланувчи огоҳлантирилади.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        3. Фойдаланувчи томонидан Операторга етказилиши керак
                        бўлган шахсий ва бошқа маълумотлар рўйхати
                      </h3>
                      <p className="mb-2">
                        3.1. Фойдаланувчи томонидан Ботдан фойдаланилганда
                        Операторга қуйидаги Шахсий маълумотлар тақдим этилади:
                      </p>
                      <p className="mb-2">
                        3.1.1. Фойдаланувчининг Ботдаги маълумотларни киритиш
                        майдонларини тўлдиришда киритган ўзи ҳақида ишончли
                        шахсий маълумотлари шу жумладан: фамилияси, исми,
                        отасининг исми, электрон почта манзили, телефон рақами
                        ва бошқалар.
                      </p>
                      <p className="mb-2">
                        3.1.2. Жараён давомида қурилмада ўрнатилган дастурий
                        таъминот орқали Бот хизматларига автоматик равишда
                        узатиладиган маълумотлар, шу жумладан IP-манзил,
                        cооkie-файллардан олинган маълумотлар, фойдаланувчи
                        браузери (ёки у билан бирга бўлган бошқа дастур) ҳақида
                        маълумот хизматлари.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        4. Шахсий маълумотларни йиғиш ва улардан фойдаланиш
                        мақсадлари, қоидалари
                      </h3>
                      <p className="mb-2">
                        4.1. Оператор Фойдаланувчига хизматлар кўрсатиш учун
                        зарур бўлган шахсий маълумотларни қайта ишлайди.
                      </p>
                      <p className="mb-2">
                        4.2. Фойдаланувчининг шахсий маълумотларидан Оператор
                        қуйидаги мақсадларда фойдаланади:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>4.2.1. Фойдаланувчининг идентификатори.</li>
                        <li>
                          4.2.2. Фойдаланувчига Ботнинг шахсийлаштирилган
                          хизматлар ва хизматларини тақдим этиш.
                        </li>
                        <li>
                          4.2.3. Бот орқали фойдаланувчи билан алоқани сақлаш,
                          шу жумладан фойдаланиш билан боғлиқ хабарномалар,
                          сўровлар ва маълумотларни юбориш Бот хизматларни
                          тақдим этиш, шунингдек сўров ва аризаларни кўриб
                          чиқиш.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">5. Бошқа шартлар</h3>
                      <p className="mb-2">
                        5.1. Оператор фойда кўрмаслик, маълумот ёки тежашни
                        йўқотиш, Ботдан фойдаланиш ёки уни ишлата олмаслик билан
                        боғлиқ ҳар қандай зарар учун фойдаланувчи олдида
                        жавобгар эмас.
                      </p>
                      <p className="mb-2">
                        5.2. Ушбу Шартномадан келиб чиқадиган барча мумкин
                        бўлган низолар Ўзбекистон Республикасининг амалдаги
                        қонунчилигига мувофиқ кўриб чиқилади.
                      </p>
                      <p className="mb-2">
                        5.3. Оператор ушбу Шартномага фойдаланувчига ҳеч қандай
                        махсус хабарнома йўлламай ўзгартириш киритиш ҳуқуқига
                        эга. Шартноманинг янги таҳрири эълон қилинган кундан
                        эътиборан кучга киради.
                      </p>
                      <p className="mb-2">
                        5.4. Шахсий маълумотларни қайта ишлашга розиликни бекор
                        қилиш Операторга тегишли ёзма хабар (қўлда ёзилган ва
                        Фойдаланувчи томонидан имзоланган) юбориш орқали амалга
                        оширилиши мумкин.
                      </p>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>
                          Барча савол ва таклифларингизни info@cbu.uz манзилига
                          юборишингиз мумкин.
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 mx-4 sm:mx-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={isAgreed}
                    onChange={handleAgreementChange}
                    className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    <strong>
                      Мен юқорида келтирилган шартларни тўлиқ ўқиб чиқдим ва
                      уларни қабул қиламан.
                    </strong>
                    Шахсий маълумотларимни қайта ишлашга рози бўлиб, ариза
                    топшириш жараёнини давом эттиришни хоҳлайман.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 pb-6 px-4 sm:px-6 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Orqaga
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!isAgreed}
                  className={`flex-1 py-3 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-300 ${
                    isAgreed
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Davom etish
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditionsPage;
