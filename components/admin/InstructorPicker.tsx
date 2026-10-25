import { useLanguage } from "@/hooks/useLanguage";
import { useInstructors } from "@/hooks/useInstructors";
import PickerField from "./PickerField";

type Props = {
  instructorId: string;
  setInstructorId: (v: string) => void;
};

/** Picker of users with role "professeur"/"admin" — shared between the
 * course and parcours admin forms so both link to a real account. */
export default function InstructorPicker({ instructorId, setInstructorId }: Props) {
  const { t } = useLanguage();
  const { instructors } = useInstructors();

  return (
    <PickerField
      label={t("admin.modals.course.instructor")}
      selectedValue={instructorId}
      onValueChange={setInstructorId}
      placeholder={t("admin.form.none")}
      items={instructors.map((u) => ({ label: u.name, value: u.id }))}
    />
  );
}
