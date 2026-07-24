import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
            <h1 className="text-8xl sm:text-9xl font-bold text-primary">404</h1>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                No encontramos la página que buscas.
            </p>
            <Link
                to="/"
                className="mt-6 text-sm font-medium text-primary hover:underline"
            >
                Volver al inicio
            </Link>
        </div>
    );
};

export default NotFoundPage;
