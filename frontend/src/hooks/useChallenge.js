import { useState, useEffect } from "react";
import { getChallengeById } from "../services/challenges";

export const useChallenge = (id) => {
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getChallengeById(id)
            .then(response => setChallenge(response.data.challenge))
            .catch(error =>
                setError(error))
            .finally(() => setLoading(false));
    }, [id]);
    return { challenge, loading, error }
}
