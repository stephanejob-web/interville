import { useChallenge } from '../../hooks/useChallenge';

export const ChallengeCard = ({ testId }) => {

    const { challenge, loading, error } = useChallenge(testId);

    if (loading) return <p> Chargement... </p>
    if (error) return <p> Erreur lors du chargement du challenge </p>;
    return (
        <div className='card w-96 bg-base-100 card-xl shadow-sm'
            style={{ backgroundColor: '#F5E6D3', width: '50rem' }}
        >
            <div className="card-body" >
                <h2 className="card-title" style={{ color: '#8B4513' }}>{challenge.title}</h2>
                <div>
                    <p>Propose par : <a href="#">{challenge.author_pseudo}</a></p>
                    <i className="fa-regular fa-heart"></i>
                </div>
                <div>
                    <img src="" alt="" />
                    <p>{challenge.description}</p>
                </div>
                <div>
                    <p>Categorie: {challenge.difficulty} </p>
                    <p>Difficulté: <span>Facile</span> </p>
                    <p>Participants actifs: <span>12</span> </p>
                </div>
                <div>
                    <button

                    > Commenter</button>
                    <button>Participer</button>
                    <button>Voir plus</button>
                </div>
            </div>
        </div>
    )
}