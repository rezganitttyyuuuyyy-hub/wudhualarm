import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// بنك أسئلة ضخم وممتع يحتوي على أكثر من 50 سؤالاً متجدداً
const allPuzzles = [
  { id: 1, difficulty: 'سهل', question: 'كم عدد أعياد المسلمين في السنة؟', options: ['عيد واحد', 'عيدان', 'ثلاثة أعياد', 'أربعة أعياد'], correct: 'عيدان' },
  { id: 2, difficulty: 'متوسط', question: 'من هو الصحابي الذي لقب بأسد الله؟', options: ['خالد بن الوليد', 'حمزة بن عبد المطلب', 'علي بن أبي طالب', 'عمر بن الخطاب'], correct: 'حمزة بن عبد المطلب' },
  { id: 3, difficulty: 'سهل', question: 'ما هي السورة التي تسمى بروح القرآن؟', options: ['سورة البقرة', 'سورة يس', 'سورة الرحمن', 'سورة الملك'], correct: 'سورة يس' },
  { id: 4, difficulty: 'متوسط', question: 'كم عدد السجدات في القرآن الكريم؟', options: ['10 سجدات', '14 سجدة', '15 سجدة', '20 سجدة'], correct: '14 سجدة' },
  { id: 5, difficulty: 'صعب', question: 'ما هي أول صلاة فرضت في الإسلام؟', options: ['صلاة الفجر', 'صلاة الظهر', 'صلاة العصر', 'صلاة المغرب'], correct: 'صلاة الظهر' },
  { id: 6, difficulty: 'سهل', question: 'كم عدد سور القرآن الكريم؟', options: ['112 سورة', '114 سورة', '120 سورة', '100 سورة'], correct: '114 سورة' },
  { id: 7, difficulty: 'متوسط', question: 'من هو أول مؤذن في الإسلام؟', options: ['عمار بن ياسر', 'بلال بن رباح', 'أبو بكر الصديق', 'عثمان بن عفان'], correct: 'بلال بن رباح' },
  { id: 8, difficulty: 'سهل', question: 'في أي شهر نزلت آيات القرآن الكريمة الأولى؟', options: ['شعبان', 'رمضان', 'رجب', 'ذو الحجة'], correct: 'رمضان' },
  { id: 9, difficulty: 'صعب', question: 'كم عدد غزوات الرسول صلى الله عليه وسلم؟', options: ['19 غزوة', '27 غزوة', '35 غزوة', '12 غزوة'], correct: '27 غزوة' },
  { id: 10, difficulty: 'متوسط', question: 'من هو الصحابي الملقب بذو النورين؟', options: ['عثمان بن عفان', 'علي بن أبي طالب', 'عمر بن الخطاب', 'الزبير بن العوام'], correct: 'عثمان بن عفان' },
  { id: 11, difficulty: 'سهل', question: 'ما هي أطول سورة في القرآن الكريم؟', options: ['سورة آل عمران', 'سورة البقرة', 'سورة النساء', 'سورة المائدة'], correct: 'سورة البقرة' },
  { id: 12, difficulty: 'متوسط', question: 'ما هي أقصر سورة في القرآن الكريم؟', options: ['سورة العصر', 'سورة الكوثر', 'سورة الإخلاص', 'سورة الناس'], correct: 'سورة الكوثر' },
  { id: 13, difficulty: 'صعب', question: 'من هو الصحابي الذي اهتز لموته عرش الرحمن؟', options: ['سعد بن معاذ', 'حارثة بن النعمان', 'أسيد بن حضير', 'عبد الله بن عمر'], correct: 'سعد بن معاذ' },
  { id: 14, difficulty: 'سهل', question: 'كم عدد حفر الخندق في غزوة الخندق؟', options: ['لم يحفروا خندقاً', 'حفروا خندقاً واحداً', 'خندقين', 'ثلاثة خنادق'], correct: 'حفروا خندقاً واحداً' },
  { id: 15, difficulty: 'متوسط', question: 'ما هي المدينة التي هاجر إليها المسلمون في الهجرة الأولى؟', options: ['المدينة المنورة', 'الطائف', 'الحبشة', 'الشام'], correct: 'الحبشة' },
  { id: 16, difficulty: 'سهل', question: 'كم عدد الركعات في صلاة الفجر؟', options: ['ركعة واحدة', 'ركعتان', 'ثلاث ركعات', 'أربع ركعات'], correct: 'ركعتان' },
  { id: 17, difficulty: 'متوسط', question: 'من هو النبي الذي ألقي في النار فجعلها الله برداً وسلاماً؟', options: ['موسى عليه السلام', 'إبراهيم عليه السلام', 'عيسى عليه السلام', 'نوح عليه السلام'], correct: 'إبراهيم عليه السلام' },
  { id: 18, difficulty: 'صعب', question: 'كم سنة لبث نوح عليه السلام يدعو قومه؟', options: ['500 سنة', '800 سنة', '950 سنة', '1000 سنة'], correct: '950 سنة' },
  { id: 19, difficulty: 'سهل', question: 'ما هو الحيوان الذي صبر معه نبي الله أوب؟', options: ['الجمل', 'لا يوجد حيوان محدد', 'الناقة', 'الكلب'], correct: 'لا يوجد حيوان محدد' },
  { id: 20, difficulty: 'متوسط', question: 'من هي أم المؤمنين الملقبة بأم المساكين؟', options: ['زينب بنت خزيمة', 'سودة بنت زمعة', 'حفصة بنت عمر', 'ميمونة بنت الحارث'], correct: 'زينب بنت خزيمة' },
  { id: 21, difficulty: 'سهل', question: 'كم عدد الصلوات المفروضة في اليوم والليلة؟', options: ['3 صلوات', '4 صلوات', '5 صلوات', '6 صلوات'], correct: '5 صلوات' },
  { id: 22, difficulty: 'متوسط', question: 'ما هو اسم جبل النور الذي يوجد به غار حراء؟', options: ['جبل ثور', 'جبل أحد', 'جبل النور', 'جبل عرفات'], correct: 'جبل النور' },
  { id: 23, difficulty: 'صعب', question: 'من هو أول من كتب التاريخ الهجري؟', options: ['عمر بن الخطاب', 'عثمان بن عفان', 'علي بن أبي طالب', 'معاوية بن أبي سفيان'], correct: 'عمر بن الخطاب' },
  { id: 24, difficulty: 'سهل', question: 'كم عدد أركان الإسلام؟', options: ['3 أركان', '4 أركان', '5 أركان', '6 أركان'], correct: '5 أركان' },
  { id: 25, difficulty: 'متوسط', question: 'كم عدد أركان الإيمان؟', options: ['4 أركان', '5 أركان', '6 أركان', '7 أركان'], correct: '6 أركان' },
  { id: 26, difficulty: 'سهل', question: 'ما هي السورة التي تسمى عروس القرآن؟', options: ['سورة الملك', 'سورة الرحمن', 'سورة يس', 'سورة الواقعة'], correct: 'سورة الرحمن' },
  { id: 27, difficulty: 'متوسط', question: 'من هو النبي الملقب بكليم الله؟', options: ['إبراهيم عليه السلام', 'موسى عليه السلام', 'عيسى عليه السلام', 'نوح عليه السلام'], correct: 'موسى عليه السلام' },
  { id: 28, difficulty: 'صعب', question: 'كم عدد الأنبياء والرسل المذكورين في القرآن الكريم؟', options: ['20 نبياً', '25 نبياً', '30 نبياً', '40 نبياً'], correct: '25 نبياً' },
  { id: 29, difficulty: 'سهل', question: 'ما هو أول مسجد بني في الإسلام؟', options: ['المسجد الحرام', 'مسجد قباء', 'المسجد النبوي', 'المسجد الأقصى'], correct: 'مسجد قباء' },
  { id: 30, difficulty: 'متوسط', question: 'من هو الصحابي الذي لقب بسيف الله المسلول؟', options: ['حمزة بن عبد المطلب', 'خالد بن الوليد', 'عمر بن الخطاب', 'أبو عبيدة بن الجراح'], correct: 'خالد بن الوليد' },
  { id: 31, difficulty: 'سهل', question: 'في أي عام هجري وقعت غزوة بدر الكبرى؟', options: ['السنة الأولى للهجرة', 'السنة الثانية للهجرة', 'السنة الثالثة للهجرة', 'السنة الرابعة للهجرة'], correct: 'السنة الثانية للهجرة' },
  { id: 32, difficulty: 'متوسط', question: 'ما هي سورة البراءة؟', options: ['سورة الأنفال', 'سورة التوبة', 'سورة محمد', 'سورة الفتح'], correct: 'سورة التوبة' },
  { id: 33, difficulty: 'صعب', question: 'كم كان عمر النبي صلى الله عليه وسلم عند بعثته؟', options: ['35 سنة', '40 سنة', '45 سنة', '50 سنة'], correct: '40 سنة' },
  { id: 34, difficulty: 'سهل', question: 'ما هي عاصمة الوحي؟', options: ['المدينة المنورة', 'مكة المكرمة', 'القدس', 'الطائف'], correct: 'مكة المكرمة' },
  { id: 35, difficulty: 'متوسط', question: 'من هو الصحابي الذي افتدى النبي صلى الله عليه وسلم بنفسه في فراشه ليلة الهجرة؟', options: ['أبو بكر الصديق', 'علي بن أبي طالب', 'عثمان بن عفان', 'عمر بن الخطاب'], correct: 'علي بن أبي طالب' },
  { id: 36, difficulty: 'سهل', question: 'ما هو الصيام المكتوب على المسلمين؟', options: ['صيام رجب', 'صيام شعبان', 'صيام رمضان', 'صيام عاشوراء'], correct: 'صيام رمضان' },
  { id: 37, difficulty: 'متوسط', question: 'من هو النبي الذي ابتلعه الحوت؟', options: ['موسى عليه السلام', 'يونس عليه السلام', 'أيوب عليه السلام', 'يوسف عليه السلام'], correct: 'يونس عليه السلام' },
  { id: 38, difficulty: 'صعب', question: 'كم مرة ذكر اسم النبي محمد صلى الله عليه وسلم في القرآن الكريم؟', options: ['مرة واحدة', 'مرتان', '3 مرات', '4 مرات'], correct: '4 مرات' },
  { id: 39, difficulty: 'سهل', question: 'ما هي أطول آية في القرآن الكريم؟', options: ['آية الكرسي', 'آية الدين', 'أول سورة البقرة', 'خواتيم البقرة'], correct: 'آية الدين' },
  { id: 40, difficulty: 'متوسط', question: 'من هو الصحابي الملقب بترجمان القرآن؟', options: ['عبد الله بن عباس', 'عبد الله بن مسعود', 'زيد بن ثابت', 'عتبة بن ربيعة'], correct: 'عبد الله بن عباس' },
  { id: 41, difficulty: 'سهل', question: 'كم عدد أجزاء القرآن الكريم؟', options: ['20 جزءاً', '25 جزءاً', '30 جزءاً', '40 جزءاً'], correct: '30 جزءاً' },
  { id: 42, difficulty: 'متوسط', question: 'ما هو اسم باب الجنة الذي يدخل منه الصائمون؟', options: ['باب الصلاة', 'باب الريان', 'باب التوبة', 'باب الجهاد'], correct: 'باب الريان' },
  { id: 43, difficulty: 'صعب', question: 'من هو الملك الموكل بالصور (نفخ الصور)?', options: ['جبريل عليه السلام', 'ميكائيل عليه السلام', 'إسرافيل عليه السلام', 'عزرائيل عليه السلام'], correct: 'إسرافيل عليه السلام' },
  { id: 44, difficulty: 'سهل', question: 'ما هي صلاة الاستسقاء؟', options: ['صلاة لطلب المطر', 'صلاة لطلب الرزق', 'صلاة الخوف', 'صلاة الكسوف'], correct: 'صلاة لطلب المطر' },
  { id: 45, difficulty: 'متوسط', question: 'من هو الصحابي الذي أشار على النبي بحفر الخندق؟', options: ['أبو بكر الصديق', 'سلمان الفارسي', 'عمر بن الخطاب', 'بلال بن رباح'], correct: 'سلمان الفارسي' },
  { id: 46, difficulty: 'سهل', question: 'ما هو اليوم الذي خلقت فيه آدم عليه السلام؟', options: ['يوم الأربعاء', 'يوم الخميس', 'يوم الجمعة', 'يوم السبت'], correct: 'يوم الجمعة' },
  { id: 47, difficulty: 'متوسط', question: 'من هو أول من أسلم من الموالي؟', options: ['زيد بن حارثة', 'بلال بن رباح', 'عمار بن ياسر', 'صهيب الرومي'], correct: 'زيد بن حارثة' },
  { id: 48, difficulty: 'صعب', question: 'كم استمرت خلافة أبو بكر الصديق رضي الله عنه؟', options: ['سنتان وبعض الشهر', 'أربع سنوات', 'عشر سنوات', 'سنة واحدة'], correct: 'سنتان وبعض الشهر' },
  { id: 49, difficulty: 'سهل', question: 'ما هي السورة التي تبدأ ببسم الله الرحمن الرحيم وتخلو من البسملة في أولها؟', options: ['سورة الأنفال', 'سورة التوبة', 'سورة الأنعام', 'سورة يونس'], correct: 'سورة التوبة' },
  { id: 50, difficulty: 'متوسط', question: 'من هو الصحابي الملقب بحبر الأمة؟', options: ['عبد الله بن عباس', 'عبد الله بن عمر', 'أنس بن مالك', 'عثمان بن عفان'], correct: 'عبد الله بن عباس' }
];

export default function PuzzlesScreen() {
  const [randomPuzzle, setRandomPuzzle] = useState(() => allPuzzles[Math.floor(Math.random() * allPuzzles.length)]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  const handleSubmit = () => {
    if (!selectedOption) {
      Alert.alert('تنبيه', 'الرجاء اختيار إجابة أولاً');
      return;
    }

    if (attemptsLeft <= 0) {
      Alert.alert('انتهت المحاولات', 'يرجى مشاهدة إعلان للحصول على 5 محاولات جديدة');
      return;
    }

    if (selectedOption === randomPuzzle.correct) {
      setScore(prev => prev + 1.5);
      Alert.alert('إجابة صحيحة!', 'كسبت 1.5 نقطة');
    } else {
      Alert.alert('إجابة خاطئة', `الإجابة الصحيحة هي: ${randomPuzzle.correct}`);
    }

    setAttemptsLeft(prev => prev - 1);
    setSelectedOption(null);
    
    // سحب لغز عشوائي جديد تماماً من بين الـ 50 سؤالاً دون تكرار فوري
    let nextPuzzle;
    do {
      nextPuzzle = allPuzzles[Math.floor(Math.random() * allPuzzles.length)];
    } while (nextPuzzle.id === randomPuzzle.id && allPuzzles.length > 1);

    setRandomPuzzle(nextPuzzle);
  };

  const handleWatchAd = () => {
    setAttemptsLeft(5);
    Alert.alert('مبروك', 'تم إضافة 5 محاولات جديدة بنجاح!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ألغاز إسلامية متجددة</Text>
        <Text style={styles.headerSubtitle}>أكثر من 50 سؤالاً متوعاً واكسب 1.5 نقطة لكل إجابة</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="ellipse-outline" size={20} color="#10b981" />
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={20} color="#fbbf24" />
          <Text style={styles.statValue}>{attemptsLeft}</Text>
        </View>
      </View>

      <View style={styles.attemptsBox}>
        <Text style={styles.attemptsText}>المحاولات المتبقية: {attemptsLeft}/5</Text>
      </View>

      {attemptsLeft > 0 ? (
        <View style={styles.questionCard}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{randomPuzzle.difficulty}</Text>
          </View>
          <Text style={styles.questionText}>{randomPuzzle.question}</Text>

          {randomPuzzle.options.map((option, index) => {
            const letter = ['A', 'B', 'C', 'D'][index];
            const isSelected = selectedOption === option;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.optionButton, isSelected && styles.selectedOption]}
                onPress={() => setSelectedOption(option)}
              >
                <Text style={styles.optionLetter}>{letter}</Text>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>إرسال الإجابة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.adCard}>
          <Ionicons name="play-circle-outline" size={48} color="#34d399" />
          <Text style={styles.adTitle}>انتهت محاولاتك!</Text>
          <Text style={styles.adSubtitle}>شاهد إعلان قصير واكسب 5 محاولات جديدة للمتابعة</Text>
          <TouchableOpacity style={styles.adButton} onPress={handleWatchAd}>
            <Text style={styles.adButtonText}>شاهد إعلان (+5 محاولات)</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b132b' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  header: { marginTop: 20, marginBottom: 15 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  headerSubtitle: { fontSize: 13, color: '#94a3b8' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statCard: { flex: 1, backgroundColor: '#132247', borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: '#1e293b', flexDirection: 'row', justifyContent: 'center' },
  statValue: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  attemptsBox: { backgroundColor: '#132247', borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  attemptsText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  questionCard: { backgroundColor: '#132247', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1e3a8a' },
  badgeContainer: { alignSelf: 'flex-start', backgroundColor: '#064e3b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  badgeText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
  questionText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 20 },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  selectedOption: { borderColor: '#10b981', backgroundColor: '#064e3b' },
  optionLetter: { color: '#94a3b8', fontWeight: 'bold', marginRight: 15, fontSize: 16 },
  optionText: { color: '#ffffff', fontSize: 15 },
  submitButton: { backgroundColor: '#059669', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  adCard: { backgroundColor: '#132247', borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#1e3a8a' },
  adTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 10, marginBottom: 5 },
  adSubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
  adButton: { backgroundColor: '#059669', borderRadius: 12, padding: 15, width: '100%', alignItems: 'center' },
  adButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
   
