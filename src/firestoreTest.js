import LS from "./common/localStorage";
import {
  mapDoc,
  getPage,
  find,
  add,
  update,
  remove,
  listen,
  signIn,
  signUp,
  onAuthChanged,
  getCurrentUser,
  register,
  sendRestPasswordMail,
  reAuthenticate,
  changePassword,
  login
} from "./common/firebase";

// the JS begining date
const dateZero = new Date(0).toString();
// seed data todos
const todos = [
  {
    title: "Learning GraphQL is awesome ...",
    completed: false
  },
  {
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    title: "fugiat veniam minus",
    completed: false
  },
  {
    title: "et porro tempora",
    completed: true
  },
  {
    title: "laboriosam mollitia et enim quasi adipisci quia provident illum",
    completed: false
  },
  {
    title: "qui ullam ratione quibusdam voluptatem quia omnis",
    completed: false
  },
  {
    title: "illo expedita consequatur quia in",
    completed: false
  },
  {
    title: "quo adipisci enim quam ut ab",
    completed: true
  },
  {
    title: "molestiae perspiciatis ipsa",
    completed: false
  },
  {
    title: "illo est ratione doloremque quia maiores aut",
    completed: true
  },
  {
    title: "vero rerum temporibus dolor",
    completed: true
  },
  {
    title: "ipsa repellendus fugit nisi",
    completed: true
  },
  {
    title: "et doloremque nulla",
    completed: false
  },
  {
    title: "repellendus sunt dolores architecto voluptatum",
    completed: true
  },
  {
    title: "ab voluptatum amet voluptas",
    completed: true
  },
  {
    title: "accusamus eos facilis sint et aut voluptatem",
    completed: true
  },
  {
    title: "quo laboriosam deleniti aut qui",
    completed: true
  },
  {
    title: "dolorum est consequatur ea mollitia in culpa",
    completed: false
  },
  {
    title: "molestiae ipsa aut voluptatibus pariatur dolor nihil",
    completed: true
  },
  {
    title: "ullam nobis libero sapiente ad optio sint",
    completed: true
  },
  {
    title: "suscipit repellat esse quibusdam voluptatem incidunt",
    completed: false
  },
  {
    title: "distinctio vitae autem nihil ut molestias quo",
    completed: true
  },
  {
    title: "et itaque necessitatibus maxime molestiae qui quas velit",
    completed: false
  },
  {
    title: "adipisci non ad dicta qui amet quaerat doloribus ea",
    completed: false
  },
  {
    title: "voluptas quo tenetur perspiciatis explicabo natus",
    completed: true
  },
  {
    title: "aliquam aut quasi",
    completed: true
  },
  {
    title: "veritatis pariatur delectus",
    completed: true
  },
  {
    title: "nesciunt totam sit blanditiis sit",
    completed: false
  },
  {
    title: "laborum aut in quam",
    completed: false
  },
  {
    title:
      "nemo perspiciatis repellat ut dolor libero commodi blanditiis omnis",
    completed: true
  }
];
// seed data villages
const villages = [
  { "region": "بني سويف", "district": "اهناسيا الخضراء", "village": "اهناسيا الخضراء" },
  { "region": "بني سويف", "district": "اهناسيا الخضراء", "village": "بنى عفان" },
  { "region": "بني سويف", "district": "اهناسيا الخضراء", "village": "دموشيا" },
  { "region": "بني سويف", "district": "باروط", "village": "باروط" },
  { "region": "بني سويف", "district": "باروط", "village": "منشأة عاصم" },
  { "region": "بني سويف", "district": "باروط", "village": "اهوه" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "تزمنت الشرقية" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "منشأة حيدر" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "الحلابية" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "نزلة معارك" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "تزمنت الغربية" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "بنى هارون" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "الدوية" },
  { "region": "بني سويف", "district": "تزمنت الشرقية", "village": "الزرابى" },
  { "region": "بني سويف", "district": "بليفيا", "village": "بلفيا" },
  { "region": "بني سويف", "district": "بليفيا", "village": "بنى حمد" },
  { "region": "بني سويف", "district": "بليفيا", "village": "بنى بخيت" },
  { "region": "بني سويف", "district": "بليفيا", "village": "الحكامنة" },
  { "region": "بني سويف", "district": "بليفيا", "village": "الدوالطة" },
  { "region": "بني سويف", "district": "بليفيا", "village": "بنى رضوان" },
  { "region": "بني سويف", "district": "شريف باشا", "village": "شريف باشا" },
  { "region": "بني سويف", "district": "شريف باشا", "village": "نعيم" },
  { "region": "بني سويف", "district": "شريف باشا", "village": "رياض" },
  { "region": "بني سويف", "district": "شريف باشا", "village": "الكوم الاحمر" },
  { "region": "بني سويف", "district": "شريف باشا", "village": "منقريش" },
  { "region": "بني سويف", "district": "شريف باشا", "village": "ابوسليم" },
  { "region": "بني سويف", "district": "ابشنا", "village": "ابشنا" },
  { "region": "بني سويف", "district": "ابشنا", "village": "باها العجوز" },
  { "region": "بني سويف", "district": "ابشنا", "village": "نزله السعادنه" },
  { "region": "بني سويف", "district": "ابشنا", "village": "حاجر بنى سليمان" },
  { "region": "بني سويف", "district": "بياض العرب", "village": "بياض العرب" },
  { "region": "بني سويف", "district": "بياض العرب", "village": "بنى سليمان" },
  { "region": "بني سويف", "district": "بياض العرب", "village": "سنور" },
  { "region": "بني سويف", "district": "بياض العرب", "village": "تل ناروز" },
  { "region": "الواسطي", "district": "جزيرة المساعدة", "village": "جزيرة المساعدة" },
  { "region": "الواسطي", "district": "جزيرة المساعدة", "village": "المصلوب" },
  { "region": "الواسطي", "district": "جزيرة المساعدة", "village": "زاوية المصلوب" },
  { "region": "الواسطي", "district": "اطواب", "village": "اطواب" },
  { "region": "الواسطي", "district": "اطواب", "village": "عطف افوه" },
  { "region": "الواسطي", "district": "اطواب", "village": "جزيرةالنور" },
  { "region": "الواسطي", "district": "اطواب", "village": "افوه" },
  { "region": "الواسطي", "district": "قمن العروس", "village": "قمن العروس" },
  { "region": "الواسطي", "district": "قمن العروس", "village": "كفر ابجيج" },
  { "region": "الواسطي", "district": "قمن العروس", "village": "بنى غنيم" },
  { "region": "الواسطي", "district": "قمن العروس", "village": "كوم ادريجه" },
  { "region": "الواسطي", "district": "قمن العروس", "village": "الديابية" },
  { "region": "الواسطي", "district": "قمن العروس", "village": "كفر بنى عتمان" },
  { "region": "الواسطي", "district": "ابو صير الملق", "village": "ابو صير الملق" },
  { "region": "الواسطي", "district": "ابو صير الملق", "village": "معصره ابو صير" },
  { "region": "الواسطي", "district": "ابو صير الملق", "village": "النواميس" },
  { "region": "الواسطي", "district": "ابو صير الملق", "village": "منشاه ابو صير" },
  { "region": "الواسطي", "district": "الميمون", "village": "الميمون" },
  { "region": "الواسطي", "district": "الميمون", "village": "بنى نصير" },
  { "region": "الواسطي", "district": "الميمون", "village": "نزله الجندى" },
  { "region": "الواسطي", "district": "الميمون", "village": "بنى سليمان البحرية" },
  { "region": "الواسطي", "district": "الميمون", "village": "بنى حدير" },
  { "region": "الواسطي", "district": "ميدوم", "village": "ميدوم" },
  { "region": "الواسطي", "district": "ميدوم", "village": "الهرم" },
  { "region": "الواسطي", "district": "ميدوم", "village": "صفط الشرقية" },
  { "region": "الواسطي", "district": "ميدوم", "village": "الحومه" },
  { "region": "الواسطي", "district": "ميدوم", "village": "صفط الغربية" },
  { "region": "الواسطي", "district": "انفسط", "village": "انفسط" },
  { "region": "الواسطي", "district": "انفسط", "village": "ونا القس" },
  { "region": "الواسطي", "district": "انفسط", "village": "كوم ابو راضى" },
  { "region": "الواسطي", "district": "انفسط", "village": "بنى محمد البحرية" },
  { "region": "الواسطي", "district": "انفسط", "village": "ابو يط" },
  { "region": "ناصر", "district": "اشمنت", "village": "اشمنت" },
  { "region": "ناصر", "district": "اشمنت", "village": "جزيرة ابو صالح" },
  { "region": "ناصر", "district": "اشمنت", "village": "كفر الجزيرة" },
  { "region": "ناصر", "district": "اشمنت", "village": "منشاة الشركة" },
  { "region": "ناصر", "district": "بنى عدى", "village": "بنى عدى" },
  { "region": "ناصر", "district": "بنى عدى", "village": "الرياض" },
  { "region": "ناصر", "district": "بنى عدى", "village": "الزيتون" },
  { "region": "ناصر", "district": "دلاص", "village": "دلاص" },
  { "region": "ناصر", "district": "دلاص", "village": "بهبشين" },
  { "region": "ناصر", "district": "دلاص", "village": "طنسا الملق" },
  { "region": "ناصر", "district": "دلاص", "village": "طحا بوش" },
  { "region": "ناصر", "district": "دنديل", "village": "دنديل" },
  { "region": "ناصر", "district": "دنديل", "village": "البرج" },
  { "region": "ناصر", "district": "دنديل", "village": "كوم ابو خلاد" },
  { "region": "ناصر", "district": "الحمام", "village": "الحمام" },
  { "region": "ناصر", "district": "الحمام", "village": "بنى خليفه" },
  { "region": "ناصر", "district": "الحمام", "village": "المنصورة" },
  { "region": "ناصر", "district": "الحمام", "village": "غيط البحارى" },
  { "region": "ناصر", "district": "الحمام", "village": "الحرجة" },
  { "region": "ناصر", "district": "الحمام", "village": "منشاة هديب" },
  { "region": " اهناسيا", "district": "براوه الوقف", "village": "براوه الوقف" },
  { "region": " اهناسيا", "district": "براوه الوقف", "village": "دير براوه" },
  { "region": " اهناسيا", "district": "براوه الوقف", "village": "نزلة خلف" },
  { "region": " اهناسيا", "district": "براوه الوقف", "village": "منشاه الحاج" },
  { "region": " اهناسيا", "district": "براوه الوقف", "village": "ميانه" },
  { "region": " اهناسيا", "district": "براوه الوقف", "village": "منشاه طاهر" },
  { "region": " اهناسيا", "district": "براوه الوقف", "village": "البهسمون" },
  { "region": " اهناسيا", "district": "العواونة", "village": "العواونة" },
  { "region": " اهناسيا", "district": "العواونة", "village": "سدمنت الجبل" },
  { "region": " اهناسيا", "district": "العواونة", "village": "منشاه  الامراء" },
  { "region": " اهناسيا", "district": "العواونة", "village": "كوم الرمل البحرى" },
  { "region": " اهناسيا", "district": "العواونة", "village": "منيل هانى" },
  { "region": " اهناسيا", "district": "العواونة", "village": "نزله المماليك" },
  { "region": " اهناسيا", "district": "العواونة", "village": "قلها" },
  { "region": " اهناسيا", "district": "العواونة", "village": "منهرو" },
  { "region": " اهناسيا", "district": "العواونة", "village": "منشاة البدينى" },
  { "region": " اهناسيا", "district": "العواونة", "village": "ادراسيا" },
  { "region": " اهناسيا", "district": "العواونة", "village": "الانصار" },
  { "region": " اهناسيا", "district": "قاى", "village": "قاى" },
  { "region": " اهناسيا", "district": "قاى", "village": "معصرة نعسان" },
  { "region": " اهناسيا", "district": "قاى", "village": "منيل غيضان" },
  { "region": " اهناسيا", "district": "قاى", "village": "طما فيوم" },
  { "region": " اهناسيا", "district": "قاى", "village": "بنى هانى" },
  { "region": " اهناسيا", "district": "ننا", "village": "ننا" },
  { "region": " اهناسيا", "district": "ننا", "village": "الشوبك" },
  { "region": " اهناسيا", "district": "ننا", "village": "منشاه عبد الصمد" },
  { "region": " اهناسيا", "district": "ننا", "village": "منهره" },
  { "region": " اهناسيا", "district": "ننا", "village": "بهنموه" },
  { "region": " اهناسيا", "district": "ننا", "village": "كفر ابو شهبه" },
  { "region": " اهناسيا", "district": "النويرة", "village": "النويرة" },
  { "region": " اهناسيا", "district": "النويرة", "village": "نزله شاويش" },
  { "region": " اهناسيا", "district": "النويرة", "village": "شرهى" },
  { "region": " اهناسيا", "district": "النويرة", "village": "منشاة كساب" },
  { "region": " اهناسيا", "district": "النويرة", "village": "نزلة المشارقة" },
  { "region": " اهناسيا", "district": "النويرة", "village": "قلة" },
  { "region": " اهناسيا", "district": "النويرة", "village": "المسيد الابيض" },
  { "region": " ببا", "district": "جزيرة ببا", "village": "جزيرة ببا" },
  { "region": " ببا", "district": "جزيرة ببا", "village": "كفر ناصر" },
  { "region": " ببا", "district": "جزيرة ببا", "village": "غياضه الشرقية" },
  { "region": " ببا", "district": "جزيرة ببا", "village": "جبل النور" },
  { "region": " ببا", "district": "جزيرة ببا", "village": "بنى خليل" },
  { "region": " ببا", "district": "جزيرة ببا", "village": "الجزيرة الشرقية" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "طنسا بنى مالو" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "بنى قاسم" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "البرانقه" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "الضباعنه" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "غياضة الغربية" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "بنى محمد الشرقية" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "الملاحية" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "طحا البيشه" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "كفر منصور" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "بنى عوض" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "ام الجنازير" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "الملاحية البحرية" },
  { "region": " ببا", "district": "طنسا بنى مالو", "village": "بنى ماضى" },
  { "region": " ببا", "district": "سدس", "village": "سدس" },
  { "region": " ببا", "district": "سدس", "village": "بنى عقبه" },
  { "region": " ببا", "district": "سدس", "village": "الشهيد حسن علام" },
  { "region": " ببا", "district": "سدس", "village": "منيه الجيد" },
  { "region": " ببا", "district": "سدس", "village": "هربشنت" },
  { "region": " ببا", "district": "سدس", "village": "جزيره الفقاعى" },
  { "region": " ببا", "district": "سدس", "village": "كفر جمعه" },
  { "region": " ببا", "district": "سدس", "village": "الفقاعى" },
  { "region": " ببا", "district": "قمبش الحمراء", "village": "قمبش الحمراء" },
  { "region": " ببا", "district": "قمبش الحمراء", "village": "بنى احمد" },
  { "region": " ببا", "district": "قمبش الحمراء", "village": "طوه" },
  { "region": " ببا", "district": "قمبش الحمراء", "village": "نزله الشريف" },
  { "region": " ببا", "district": "قمبش الحمراء", "village": "منيل موسى" },
  { "region": " ببا", "district": "قمبش الحمراء", "village": "البكرية" },
  { "region": " ببا", "district": "قمبش الحمراء", "village": "السلطانى" },
  { "region": " ببا", "district": "هليه", "village": "هليه" },
  { "region": " ببا", "district": "هليه", "village": "طرشوب" },
  { "region": " ببا", "district": "هليه", "village": "نزله على الكيلانى" },
  { "region": " ببا", "district": "هليه", "village": "رزقه المشارقه" },
  { "region": " ببا", "district": "هليه", "village": "زاوية الناوية" },
  { "region": " ببا", "district": "هليه", "village": "نزلة الزاوية" },
  { "region": " ببا", "district": "صفط راشين", "village": "صفط راشين" },
  { "region": " ببا", "district": "صفط راشين", "village": "فزاره" },
  { "region": " ببا", "district": "صفط راشين", "village": "بنى مؤمنه" },
  { "region": " ببا", "district": "صفط راشين", "village": "ابو شربان" },
  { "region": " ببا", "district": "صفط راشين", "village": "ابو دخان" },
  { "region": " ببا", "district": "صفط راشين", "village": "بنى هاشم" },
  { "region": " سمسطا", "district": "دشطوط", "village": "دشطوط" },
  { "region": " سمسطا", "district": "دشطوط", "village": "كوم النور" },
  { "region": " سمسطا", "district": "دشطوط", "village": "كوم الرمل القبلى" },
  { "region": " سمسطا", "district": "دشطوط", "village": "دشاشه" },
  { "region": " سمسطا", "district": "الشنطور", "village": "الشنطور" },
  { "region": " سمسطا", "district": "الشنطور", "village": "عزبه الشنطور" },
  { "region": " سمسطا", "district": "الشنطور", "village": "سربو" },
  { "region": " سمسطا", "district": "الشنطور", "village": "القصبه" },
  { "region": " سمسطا", "district": "الشنطور", "village": "عزبه قفطان" },
  { "region": " سمسطا", "district": "الشنطور", "village": "بنى محمد راشد" },
  { "region": " سمسطا", "district": "بدهل", "village": "بدهل" },
  { "region": " سمسطا", "district": "بدهل", "village": "العساكره" },
  { "region": " سمسطا", "district": "بدهل", "village": "نزله سعيد" },
  { "region": " سمسطا", "district": "بدهل", "village": "نزله الديب" },
  { "region": " سمسطا", "district": "بدهل", "village": "منشاه ابو مليح" },
  { "region": " سمسطا", "district": "بدهل", "village": "كفر بنى على" },
  { "region": " سمسطا", "district": "بدهل", "village": "بنى حله" },
  { "region": " سمسطا", "district": "مازورة", "village": "مازورة" },
  { "region": " سمسطا", "district": "مازورة", "village": "منشاه سليمان" },
  { "region": " سمسطا", "district": "مازورة", "village": "كفر الشيخ عابد" },
  { "region": " سمسطا", "district": "مازورة", "village": "المحمودية" },
  { "region": "الفشن", "district": "الفنت", "village": "الفنت" },
  { "region": "الفشن", "district": "الفنت", "village": "منشاه عمرو" },
  { "region": "الفشن", "district": "الفنت", "village": "كفر درويش" },
  { "region": "الفشن", "district": "الفنت", "village": "صالح فريد" },
  { "region": "الفشن", "district": "الفنت", "village": "الشقر" },
  { "region": "الفشن", "district": "الفنت", "village": "الفنت الغربية" },
  { "region": "الفشن", "district": "الفنت", "village": "الحيبه" },
  { "region": "الفشن", "district": "الفنت", "village": "القضابى" },
  { "region": "الفشن", "district": "ابسوج", "village": "ابسوج" },
  { "region": "الفشن", "district": "ابسوج", "village": "نزله حنا" },
  { "region": "الفشن", "district": "ابسوج", "village": "الزاويه الخضراء" },
  { "region": "الفشن", "district": "ابسوج", "village": "بنى صالح" },
  { "region": "الفشن", "district": "ابسوج", "village": "جزيرة الوكليه" },
  { "region": "الفشن", "district": "ابسوج", "village": "صفط العرفا" },
  { "region": "الفشن", "district": "تلت", "village": "تلت" },
  { "region": "الفشن", "district": "تلت", "village": "طلا" },
  { "region": "الفشن", "district": "تلت", "village": "القليعه" },
  { "region": "الفشن", "district": "تلت", "village": "صفط الخرسا" },
  { "region": "الفشن", "district": "تلت", "village": "عزبه تلت" },
  { "region": "الفشن", "district": "تلت", "village": "منشاه السادات" },
  { "region": "الفشن", "district": "دلهانس", "village": "دلهانس" },
  { "region": "الفشن", "district": "دلهانس", "village": "الجفادون" },
  { "region": "الفشن", "district": "دلهانس", "village": "الجمهود" },
  { "region": "الفشن", "district": "دلهانس", "village": "كفر منسابه" },
  { "region": "الفشن", "district": "شنرى", "village": "شنرى" },
  { "region": "الفشن", "district": "شنرى", "village": "بنى منين" },
  { "region": "الفشن", "district": "اقفهص", "village": "اقفهص" },
  { "region": "الفشن", "district": "اقفهص", "village": "البرقى" },
  { "region": "الفشن", "district": "اقفهص", "village": "الكنيسه" },
  { "region": "الفشن", "district": "اقفهص", "village": "صفط النور" },
  { "region": "الفشن", "district": "اقفهص", "village": "نزله البرقى" },
  { "region": "الفشن", "district": "اقفهص", "village": "بسفا" },
  { "region": "الفشن", "district": "اقفهص", "village": "نزله اقفهص" }
];

// CRUD test
async function run() {
  let docRef,
    querySnapshot,
    lastDate = dateZero,
    page = 1,
    timerId,
    categories = ["work", "social", "personal", "fun", "family","sport"],
    _query,
    _message,
    _currentUser,
    _cities = ["بني سويف", "الواسطي", "ناصر", "اهناسيا", "ببا","سمسطا", "الفشن"],
    _accountStatuses = ["انتظار","ممكن","معطل","مغلق"],
    _accountRoles = {
      "employee": "موظف",
      "trainer": "مدرب",
      "trainee": "متدرب"
    },
    _userTypes = {
      "employee": "موظف",
      "trainer": "مدرب",
      "trainee": "متدرب"
    },
    _evalItems = [
      "المادة العلمية",
      "التدريبات العملية",
      "المساعدات السمعية والبصرية",
      "الزمن المخصص للبرنامج",
      "قدرة المدرب علي الشرح",
      "قدرة المدرب علي إدارة البرنامج",
      "تشجيع المدرب علي مشاركة المتدرب",
      "رد المدرب علي الأسئلة",
      "مدي الاستفادة من البرنامج"
    ],
    _locationTypes = [
      "ريف",
      "حضر"
    ],
    _qualificationTypes = [
      "متوسط",
      "فوق المتوسط",
      "عالي"
    ],
    _studentTypes = [
      "طالب",
      "خريج",
      "يعمل"
    ],
    _genders = [
      "ذكر",
      "انثي"
    ],
    _maritalStatuses = [
      "أعزب",
      "متزوج",
      "مطلق",
      "أرمل"
    ];

  // #region add villages collection docs
  // villages.forEach( (village,i) => add(`villages/${i+1}`,village) );
  // #endregion

  // #region other
  // add("employees/KcjQn35H0kUumrfdIWlJ9tBBtuZ2", { jobTitle: "اخصائي صيانة حاسب" });
  // #endregion

  // #region add lookup collection docs
  // add("lookup/cities", { value: _cities });
  // add("lookup/accountStatuses", { value: _accountStatuses });
  // add("lookup/accountRoles", { value: _accountRoles });
  // add("lookup/userTypes", { value: _userTypes });
  // add("lookup/evaluationItems", { value: _evalItems });
  // add("lookup/genders", { value: _genders });
  // add("lookup/studentTypes", { value: _studentTypes });
  // add("lookup/qualificationTypes", { value: _qualificationTypes });
  // add("lookup/locationTypes", { value: _locationTypes });
  // add("lookup/maritalStatuses", { value: _maritalStatuses });
  // #endregion

  // #region test auth
  // create new user with email and password
  // await signUp("ahmady09@gmail.com","335592ah");
  // get the current created user
  // _currentUser = getCurrentUser();
  // set addtional info [displayName - photoURL]
  // await _currentUser.updateProfile({
  //   displayName: "Ahmad Hamdy",
  //   photoURL: "https://example.com/jane-q-user/profile.jpg"
  // });
  // send email verification
  // await _currentUser.sendEmailVerification();
  // log the current user
  // console.log(_currentUser);
  // #endregion

  // #region test localStrorage
  // _currentUser = JSON.parse(localStorage.getItem("login"));
  // console.log("​---------------------------------")
  // console.log("​run -> _currentUser", _currentUser)
  // console.log("​---------------------------------")
  // if(!_currentUser) {
  //   _currentUser = await login("ahmady09@gmail.com","335592ah");
  //   localStorage.setItem("login",JSON.stringify(_currentUser));
  //   console.log("​---------------------------------")
  //   console.log("​run -> _currentUser", _currentUser)
  //   console.log("​---------------------------------")
  // }
  // localStorage.removeItem("login");
  // #endregion

  // #region test LS
  // _currentUser = LS.get("login");
  // console.log("​---------------------------------")
  // console.log("​run -> _currentUser", _currentUser)
  // console.log("​---------------------------------")
  // if(!_currentUser) {
  //   _currentUser = await login("ahmady09@gmail.com","335592ah");
  //   LS.set("login",_currentUser);
  //   console.log("​---------------------------------")
  //   console.log("​run -> _currentUser", _currentUser)
  //   console.log("​---------------------------------")
  // }
  // LS.remove("login");
  // test LS with string value
  // LS.set("test","sdf");
  // console.log(LS.get("test"));
  // #endregion

  // #region test singing in
  // await signIn("ahmady09@gmail.com","335592ah");
  // _currentUser = getCurrentUser();
  // _currentUser.updatePhoneNumber("01143680055");
  // console.log(_currentUser);
  // onAuthChanged(console.log);
  // #endregion

  // #region test register user
  // _currentUser = await register({
  //   email: "ahmady09@gmail.com",
  //   password: "335592ah",
  //   displayName: "Ahmad Hamdy",
  //   photoURL: "https://example.com/jane-q-user/profile.jpg"
  // });
  // await signIn("ahmady09@gmail.com","335592ah");
  // _currentUser = getCurrentUser();
  // console.log("​---------------------------------")
  // console.log("​run -> _currentUser", _currentUser)
  // console.log("​---------------------------------")
  // #endregion

  // #region test forget password
  // await signIn("ahmady09@gmail.com","335592ah");
  // sendRestPasswordMail("ahmady09@gmail.com");
  // #endregion

  // #region test reAuthenticate a user
  // await signIn("ahmady09@gmail.com","335592ah");
  // console.log(await reAuthenticate("335592ah"));
  // #endregion

  // #region test change password
  // await signIn("ahmady09@gmail.com","335592ah");
  // await changePassword("335592ah");
  // await signIn("ahmady09@gmail.com","335592ah");
  // await signIn("ahmady09@gmail.com","123456ah");
  // await changePassword("335592ah");
  // await signIn("ahmady09@gmail.com","335592ah");
  // #endregion

  // #region test change listeners
  // listen("todos");
  // setTimeout(() => add("todos",{
  //   title: "play music ...",
  //   completed: false,
  //   category: "fun"
  // }), 5000);
  // listen("todos/wWap85jw9hOshZQwnNO7");
  // db.doc("todos/wWap85jw9hOshZQwnNO7")
  //   .onSnapshot(docRef => console.log(mapDoc(docRef)) );
  // setTimeout( async () => {
  //   update("todos/wWap85jw9hOshZQwnNO7", { completed: true });
  // },5000);
  // docRef = await find("todos/wWap85jw9hOshZQwnNO7");
  // console.log(mapDoc(docRef));
  // querySnapshot = await query("todos?title|==|do the needed work just in case ...");
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // querySnapshot.forEach( docRef =>  remove(`todos/${docRef.id}`) );
  // #endregion

  // #region manually set listners
  // db.collection("todos")
  //   .onSnapshot( snapshot => {
  //     snapshot.docChanges().forEach( change => {
  //       switch(change.type) {
  //         case "added":
  //           _message = "Added doc: ";
  //           break;
  //         case "modified":
  //           _message = "Modified doc: ";
  //           break;
  //         case "removed":
  //           _message = "Removed doc: ";
  //           break;
  //       }
  //       console.log(_message, mapDoc(change.doc) );
  //     });
  //   });
  // setTimeout(() => add("todos",{
  //   title: "go to the needed workspace ...",
  //   completed: false,
  //   category: "work"
  // }), 5000);
  // #endregion

  // #region get all orderd by created date
  // querySnapshot = await find("todos").get();
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // #endregion

  // #region get an existing doc
  // docRef = await find("todos/p6rRbuuk2stSQZ8xVaDZ").get();
  // console.log("Document: ",mapDoc(docRef));
  // #endregion

  // #region test find to do query
  // querySnapshot = await find("todos?category|==|family&completed|==|true|bool").get();
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // #endregion

  // #region listen on find (one doc)
  // find("todos/p6rRbuuk2stSQZ8xVaDZ")
  //   .onSnapshot(docRef => console.log(mapDoc(docRef)) );
  // #endregion

  // #region listen on find (query)
  // find("todos?category|==|family&completed|==|true|bool")
  //   .onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach( change => {
  //       switch(change.type) {
  //         case "added":
  //           _message = "Added doc: ";
  //           break;
  //         case "modified":
  //           _message = "Modified doc: ";
  //           break;
  //         case "removed":
  //           _message = "Removed doc: ";
  //           break;
  //       }
  //       console.log(_message, mapDoc(change.doc) );
  //     });
  //   });
  // #endregion

  // #region update one doc from the last query to test realtime updates
  // setTimeout(() => update("todos/fGgbjPybAT6OhUhwVo2W",{
  //   title: "how about my mother ..."
  // }), 5000);
  // #endregion

  // #region update doc(s) to set category field
  // querySnapshot = await find("todos");
  // querySnapshot.forEach(async todoRef => {
  //   docRef = await update(`todos/${todoRef.id}`,{ category: categories.random() });
  //   console.log("Document updated: ", mapDoc(docRef) );
  // });
  // #endregion

  // #region apply multiple where [logical And]
  // _query = db.collection("todos");
  // _query = query.where("completed", "==", true);
  // _query = query.where("category", "==", "sport");
  // querySnapshot = await _query.get();
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // #endregion

  // #region get first page data by starting after [dateZero]
  // timerId = setInterval( async () => {
  //   get the page data
  //   querySnapshot = await getPage("todos",5,lastDate);
  //   if there is no page data then cancel timer and return
  //   if (querySnapshot.size === 0) {
  //     clearInterval(timerId);
  //     return console.log("no more pages ...");
  //   }
  //   get the lastDate from the last doc
  //   lastDate = querySnapshot.docs[querySnapshot.size-1].data().createdAt;
  //   log the page doc(s)
  //   console.info(`"page ${page} start: ====================="`);
  //   querySnapshot.forEach( docRef => console.log(mapDoc(docRef)));
  //   console.info(`"page ${page} end: ======================="`);
  //   page++;
  // },3000);
  // #endregion

  // #region add the seed todos
  // todos.forEach(async todo => {
  //   docRef = await add("todos",todo);
  //   console.log("Document added: ", mapDoc(docRef) );
  // });
  // #endregion

  // #region query
  // querySnapshot = await db.collection("test").where("born","==",1992).get();
  // querySnapshot = await query("test?born|==|1992|int");
  // if (querySnapshot.size === 0)
  //   console.log("doc(s) not found ...");
  // querySnapshot.forEach( docRef => console.log(mapDoc(docRef)) );
  // #endregion

  // #region get a non existing doc
  // docRef = await find("test/2q2XKG3EBRnwVTBwIoOI")
  // console.log("Document: ",mapDoc(docRef));
  // #endregion

  // #region add a new doc with auto generated id
  // docRef = await add("test",{
  //   first: "Ramy",
  //   last: "Mohamed",
  //   born: 1998
  // })
  // console.log("Document added: ",mapDoc(docRef) );
  // #endregion

  // #region add a new doc with a given id
  // docRef = await add("test2/BA1PEZH2eB19MhpuqKtu",{
  //   city: "Alex",
  //   email: "alex@ae.com"
  // })
  // console.log("Document added: ",mapDoc(docRef) );
  // #endregion

  // #region update a doc
  // docRef = await update("test2/BA1PEZH2eB19MhpuqKtu", {
  //   city: "Benisuef",
  //   address: "this is the address ..."
  // })
  // console.log("Document: ",mapDoc(docRef));
  // #endregion

  // #region delete a doc
  // docRef = await remove("test2/BA1PEZH2eB19MhpuqKtu");
  // console.log("Document: ",mapDoc(docRef));
  // #endregion

  // #region raw firestore test
  // db.collection("test").add({
  //   first: "Ali",
  //   last: "Sayed",
  //   born: 1994
  // })
  // .then(docRef => {
  //   docRef.get().then(docRef => console.log("Document added: ",{ id: docRef.id, ...docRef.data()} ))
  // })
  // .catch(error => console.error("Error adding document: ", error));
  // db.collection("test2")
  //   .doc("2q2XKG3EBRnwVTBwPuVu")
  //   .set({ first: "Shady", last: "Hessen", born: 1997 });
  // #endregion
}
run();