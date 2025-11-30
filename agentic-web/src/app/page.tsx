import { InstructionAgent } from "@/components/InstructionAgent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <InstructionAgent />
    </main>
  );
}
