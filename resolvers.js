const Movie = require("./models/Movie");

const resolvers = {
  Query: {
    movies: async () => {
      return await Movie.find();
    },
    movie: async (parent, args) => {
      return await Movie.findById(args.id);
    },
  },

  Mutation: {
    addMovie: async (parent, args) => {
      const movie = new Movie({
        name: args.name,
        director_name: args.director_name,
        production_house: args.production_house,
        release_date: args.release_date,
        rating: args.rating,
      });
      await movie.save();
      return movie;
    },
    updateMovie: async (parent, args) => {
      const movie = await Movie.findById(args.id);
      if (!movie) throw new Error("Movie not found");
      movie.name = args.name;
      movie.director_name = args.director_name;
      movie.production_house = args.production_house;
      movie.release_date = args.release_date;
      movie.rating = args.rating;
      await movie.save();
      return movie;
    },
    deleteMovie: async (parent, args) => {
      const movie = await Movie.findById(args.id);
      if (!movie) throw new Error("Movie not found");
      await movie.deleteOne();
      return movie;
    },
  },
};

module.exports = resolvers;