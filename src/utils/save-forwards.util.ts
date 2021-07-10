import { forwardRepository } from '../database';
import { Forward } from '../database/forwards.entity';

export const saveForwards = async (forwards: Forward[], forwardTo?: Forward) => {
    for (const forward of forwards) {
        const f = await forwardRepository.save({
            ...forward,
            forwardTo
        });

        await saveForwards(forward.forwards, f);
    }
};
