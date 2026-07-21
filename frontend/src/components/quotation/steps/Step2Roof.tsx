import { PebRoof } from "../sections/roof/PebRoof";
import { BaseFixing } from "../sections/roof/BaseFixing";
import { FrameMembers } from "../sections/roof/FrameMembers";
import { Purlins } from "../sections/roof/Purlins";
import { Coverings } from "../sections/roof/Coverings";
import { FlangeBrace } from "../sections/roof/FlangeBrace";
import { Polycarbonate } from "../sections/roof/Polycarbonate";
import { WindBracing } from "../sections/roof/WindBracing";
import { CladdingOpenings } from "../sections/roof/CladdingOpenings";
import { FasciaBoard } from "../sections/roof/FasciaBoard";
import { SideExtension } from "../sections/roof/SideExtension";
import { MaterialGrade } from "../sections/roof/MaterialGrade";
import { MaterialConsumption } from "../sections/roof/MaterialConsumption";
import { SagRod } from "../sections/roof/SagRod";
import { Sidewalls } from "../sections/roof/Sidewalls";
import { useRoofHydration } from "@/hooks/useRoofHydration";

export function Step2Roof() {
    useRoofHydration();
    return (
        <section>
            <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight">Structural inputs</h2>
                <p className="text-muted-foreground text-sm mt-1">Core building dimensions and roof frame configuration.</p>
            </div>
            <PebRoof />
            <MaterialConsumption />
            <SagRod />
            <MaterialGrade />
            <FrameMembers />
            <Purlins />
            <WindBracing />
            <Sidewalls />
            <FlangeBrace />
            <CladdingOpenings />
            <FasciaBoard />
            <Coverings />
            <Polycarbonate />
            <SideExtension />
            <BaseFixing />
        </section>
    )
}
