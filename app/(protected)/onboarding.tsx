import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/color";
import type { TagType } from "@/types";
import BirthDateStep from "@/components/onboarding/BirthDateStep";
import PhoneStep from "@/components/onboarding/PhoneStep";
import InstrumentStep from "@/components/onboarding/InstrumentStep";
import LevelStep from "@/components/onboarding/LevelStep";
import GoalStep from "@/components/onboarding/GoalStep";
import StepDots from "@/components/onboarding/StepDots";

const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;
const STEP_KEYS = ["birthDate", "phone", "instrument", "level", "goal"] as const;
type StepKey = (typeof STEP_KEYS)[number];
const TAG_TYPES = ["beginner", "intermediate", "expert"] as const;

function toIsoDate(ddmmyyyy: string) {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
}

function makeOnboardingSchema(t: (key: string) => string) {
  return z.object({
    birthDate: z
      .string()
      .min(1, t("onboarding.birthDateRequired"))
      .regex(DATE_REGEX, t("onboarding.birthDateInvalid")),
    phone: z.string().min(1, t("onboarding.phoneRequired")),
    instrumentCategoryIds: z
      .array(z.string())
      .min(1, t("onboarding.instrumentRequired")),
    requestedLevel: z.enum(TAG_TYPES, {
      message: t("onboarding.levelRequired"),
    }),
    learningGoal: z.string().min(1, t("onboarding.goalRequired")),
  });
}

type OnboardingFields = z.infer<ReturnType<typeof makeOnboardingSchema>>;
type FieldErrors = Partial<Record<keyof OnboardingFields, string>>;

export default function OnboardingScreen() {
  const { completeOnboarding, completeOnboardingPending, logOut } = useAuth();
  const { categories } = useCategories();
  const { t } = useLanguage();
  const onboardingSchema = useMemo(() => makeOnboardingSchema(t), [t]);

  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [instrumentCategoryIds, setInstrumentCategoryIds] = useState<string[]>(
    [],
  );
  const [requestedLevel, setRequestedLevel] = useState<TagType | "">("");
  const [learningGoal, setLearningGoal] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [maxStepHeight, setMaxStepHeight] = useState(190);

  const listRef = useRef<FlatList<StepKey>>(null);
  const isLastStep = stepIndex === STEP_KEYS.length - 1;

  function onLayout(e: LayoutChangeEvent) {
    setPageWidth(e.nativeEvent.layout.width);
  }

  function onStepLayout(e: LayoutChangeEvent) {
    const height = e.nativeEvent.layout.height;
    setMaxStepHeight((prev) => Math.max(prev, height));
  }

  function goToStep(index: number) {
    setStepIndex(index);
    listRef.current?.scrollToIndex({ index, animated: true });
  }

  function validateStep(step: StepKey): boolean {
    const values = {
      birthDate,
      phone,
      instrumentCategoryIds,
      requestedLevel,
      learningGoal,
    };
    const fieldByStep: Record<StepKey, keyof OnboardingFields> = {
      birthDate: "birthDate",
      phone: "phone",
      instrument: "instrumentCategoryIds",
      level: "requestedLevel",
      goal: "learningGoal",
    };
    const field = fieldByStep[step];
    const result = onboardingSchema.shape[field].safeParse(values[field]);
    if (!result.success) {
      setErrors((e) => ({ ...e, [field]: result.error.issues[0]?.message }));
      return false;
    }
    setErrors((e) => ({ ...e, [field]: undefined }));
    return true;
  }

  async function handleNext() {
    const step = STEP_KEYS[stepIndex];
    if (!validateStep(step)) return;

    if (!isLastStep) {
      goToStep(stepIndex + 1);
      return;
    }

    const result = onboardingSchema.safeParse({
      birthDate,
      phone,
      instrumentCategoryIds,
      requestedLevel,
      learningGoal,
    });
    if (!result.success) return;

    setSubmitError(null);
    try {
      await completeOnboarding({
        birthDate: toIsoDate(result.data.birthDate),
        phone: result.data.phone,
        instrumentCategoryIds: result.data.instrumentCategoryIds,
        requestedLevel: result.data.requestedLevel,
        learningGoal: result.data.learningGoal,
      });
    } catch (err: any) {
      setSubmitError(err?.message ?? null);
    }
  }

  function handleBack() {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  }

  return (
    <LinearGradient
      colors={["#060F1A", color.deepBlue]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            <View style={styles.progressWrap}>
              <Text style={styles.stepLabel}>
                {t("onboarding.stepOf", {
                  current: stepIndex + 1,
                  total: STEP_KEYS.length,
                })}
              </Text>
              <StepDots total={STEP_KEYS.length} current={stepIndex} />
            </View>

            <View style={styles.card}>
              {submitError && (
                <View style={styles.serverError}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#B91C1C"
                  />
                  <Text style={styles.serverErrorText}>{submitError}</Text>
                </View>
              )}

              <View style={{ height: maxStepHeight }} onLayout={onLayout}>
                {pageWidth > 0 && (
                  <FlatList
                    ref={listRef}
                    data={STEP_KEYS}
                    keyExtractor={(k) => k}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    contentContainerStyle={styles.pageListContent}
                    getItemLayout={(_, index) => ({
                      length: pageWidth,
                      offset: pageWidth * index,
                      index,
                    })}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <View style={{ width: pageWidth }} onLayout={onStepLayout}>
                        {item === "birthDate" && (
                          <BirthDateStep
                            value={birthDate}
                            onChange={(v) => {
                              setBirthDate(v);
                              setErrors((e) => ({ ...e, birthDate: undefined }));
                            }}
                            error={errors.birthDate}
                          />
                        )}
                        {item === "phone" && (
                          <PhoneStep
                            value={phone}
                            onChange={(v) => {
                              setPhone(v);
                              setErrors((e) => ({ ...e, phone: undefined }));
                            }}
                            error={errors.phone}
                          />
                        )}
                        {item === "instrument" && (
                          <InstrumentStep
                            categories={categories}
                            value={instrumentCategoryIds}
                            onChange={(v) => {
                              setInstrumentCategoryIds(v);
                              setErrors((e) => ({
                                ...e,
                                instrumentCategoryIds: undefined,
                              }));
                            }}
                            error={errors.instrumentCategoryIds}
                          />
                        )}
                        {item === "level" && (
                          <LevelStep
                            value={requestedLevel}
                            onChange={(v) => {
                              setRequestedLevel(v);
                              setErrors((e) => ({
                                ...e,
                                requestedLevel: undefined,
                              }));
                            }}
                            error={errors.requestedLevel}
                          />
                        )}
                        {item === "goal" && (
                          <GoalStep
                            value={learningGoal}
                            onChange={(v) => {
                              setLearningGoal(v);
                              setErrors((e) => ({
                                ...e,
                                learningGoal: undefined,
                              }));
                            }}
                            error={errors.learningGoal}
                          />
                        )}
                      </View>
                    )}
                  />
                )}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.btnRow}>
              {stepIndex > 0 && (
                <Pressable
                  style={({ pressed }) => [
                    styles.backBtn,
                    pressed && styles.btnPressed,
                  ]}
                  onPress={handleBack}
                >
                  <Ionicons
                    name="arrow-back"
                    size={18}
                    color={color.deepBlue}
                  />
                </Pressable>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.nextBtn,
                  pressed && styles.btnPressed,
                ]}
                onPress={handleNext}
                disabled={completeOnboardingPending}
              >
                {completeOnboardingPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.nextBtnText}>
                      {isLastStep ? t("onboarding.submit") : t("onboarding.next")}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={color.deepBlue}
                    />
                  </>
                )}
              </Pressable>
            </View>

            <Pressable style={styles.linkBtn} onPress={() => logOut()}>
              <Text style={styles.linkText}>{t("onboarding.logout")}</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 20,
  },
  progressWrap: { alignItems: "center", gap: 10 },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.55)",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    gap: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 10,
  },

  serverError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  serverErrorText: {
    flex: 1,
    fontSize: 13,
    color: "#B91C1C",
    fontWeight: "500",
  },

  pageListContent: { alignItems: "flex-start" },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 14,
  },
  btnRow: { flexDirection: "row", gap: 10 },
  backBtn: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.paleBlue,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  nextBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: color.yellowDark,
    borderRadius: 14,
    height: 54,
    shadowColor: color.yellowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 4,
  },
  btnPressed: { opacity: 0.85 },
  nextBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: 0.3,
  },

  linkBtn: { alignSelf: "center" },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.55)",
  },
});
