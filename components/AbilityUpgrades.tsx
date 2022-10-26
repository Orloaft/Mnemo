import styled from "styled-components";

const UpgradeButton = styled.button`
  background: transparent;
  border-radius: 0.25rem;

  height: 4rem;
  width: 6rem;
  cursor: pointer;

  font-size: 1.5rem;
`;
export const AbilityUpgrades = ({ handleLevelUp, knownSpells, level }) => {
  return (
    <>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "missle")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("missle")}
        disabled={!knownSpells.find((spell) => spell.name === "missle")}
      >
        Missle
      </UpgradeButton>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "blast")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("blast")}
        disabled={level < 3}
      >
        Blast
      </UpgradeButton>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "heal")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("heal")}
        disabled={level >= 3}
      >
        Heal
      </UpgradeButton>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "silence")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("silence")}
        disabled={level >= 5}
      >
        Silence
      </UpgradeButton>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "curse")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("curse")}
        disabled={level >= 7}
      >
        Curse
      </UpgradeButton>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "revive")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("revive")}
        disabled={level >= 10}
      >
        Revive
      </UpgradeButton>
    </>
  );
};
