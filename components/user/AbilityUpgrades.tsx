import styled from "styled-components";
const ConnectingBlock = styled.div`
  height: 2rem;
  width: 6rem;
  display: flex;
  & div {
    border-right: 2px solid white;
    height: 2rem;
    width: 50%;
    border-color: ${(props: { unlocked: boolean }) =>
      props.unlocked ? "white" : "black"};
  }
`;
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
      <ConnectingBlock unlocked={level >= 2}>
        <div></div>2
      </ConnectingBlock>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "blast")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("blast")}
        disabled={level < 2}
      >
        Blast
      </UpgradeButton>
      <ConnectingBlock unlocked={level >= 4}>
        <div></div>4
      </ConnectingBlock>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "heal")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("heal")}
        disabled={level < 4}
      >
        Heal
      </UpgradeButton>
      <ConnectingBlock unlocked={level >= 6}>
        <div></div>6
      </ConnectingBlock>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "silence")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("silence")}
        disabled={level < 6}
      >
        Silence
      </UpgradeButton>
      <ConnectingBlock unlocked={level >= 8}>
        <div></div>8
      </ConnectingBlock>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "curse")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("curse")}
        disabled={level < 8}
      >
        Curse
      </UpgradeButton>
      <ConnectingBlock unlocked={level >= 10}>
        <div></div>10
      </ConnectingBlock>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "revive")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("revive")}
        disabled={level < 10}
      >
        Revive
      </UpgradeButton>
      <ConnectingBlock unlocked={level >= 12}>
        <div></div>12
      </ConnectingBlock>
      <UpgradeButton
        className={
          knownSpells.find((spell) => spell.name === "shield")
            ? `shownAbility`
            : `hiddenAbility`
        }
        onClick={() => handleLevelUp("shield")}
        disabled={level < 12}
      >
        Shield
      </UpgradeButton>
    </>
  );
};
