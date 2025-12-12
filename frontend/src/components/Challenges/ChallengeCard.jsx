import { useChallenge } from '../../hooks/useChallenge';

export const ChallengeCard = ({ testId }) => {

    const { challenge, loading, error } = useChallenge(testId);

    if (loading) return <p> Chargement... </p>
    if (error) return <p> Erreur lors du chargement du challenge </p>;
    return (
        <div
            className="card bg-base-100 shadow-xl p-4 max-w-5xl mx-auto"
            style={{ backgroundColor: '#F5E6D3' }}
        >
            <div className="card-body">

                <div className="flex gap-6">

                    <div className="flex flex-col w-1/3 text-sm text-gray-600 w-[10rem] h-[7rem] ">
                        <p className="mb-2">Proposé par : <span className="font-semibold">{challenge.author_pseudo}</span></p>
                        <p className="mb-2">Promo : <span className="font-semibold">{challenge.author_promo}</span></p>
                        <p className="mb-2">Ville : <span className="font-semibold">{challenge.author_city}</span></p>
                    </div>


                    <div className="flex-1">

                        <div className="flex justify-end mb-2">
                            <button className="btn btn-ghost p-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <h2
                            className="card-title text-2xl font-bold mb-2 flex justify-center"
                            style={{ color: '#8B4513' }}
                        >
                            {challenge.title}
                        </h2>
                        <p className="text-base text-center mb-6 p-2 ">{challenge.description}</p>

                        <div className="grid grid-cols-3 gap-6 text-center text-lg font-medium mb-6">
                            <p>{challenge.comments_count} commentaires</p>
                            <p>{challenge.likes_count} likes</p>
                            <p>{challenge.participations_count} participants actifs</p>
                        </div>

                        <div className="card-actions flex justify-between w-full">
                            <button
                                className="px-8 py-4 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                style={{ backgroundColor: '#D2691E' }}
                            >
                                Commenter
                            </button>
                            <button
                                className="px-8 py-4 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                style={{ backgroundColor: '#D2691E' }}
                            >
                                Participer
                            </button>
                            <button
                                className="px-8 py-4 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                style={{ backgroundColor: '#D2691E' }}
                            >
                                Voir plus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}