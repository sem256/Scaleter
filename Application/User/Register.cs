﻿using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.UserName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _dataContext;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext dataContext, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _dataContext = dataContext;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _dataContext.Users.Where(x => x.Email == request.Email).AnyAsync())
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists" });

                if (await _dataContext.Users.Where(x => x.UserName == request.UserName).AnyAsync())
                    throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username already exists" });

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.UserName
                };

                var results = await _userManager.CreateAsync(user, request.Password);

                if (results.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        UserName = user.UserName,
                        Token = _jwtGenerator.CreateToken(user),
                    };
                }

                throw new Exception("Problem creating user");
            }
        }
    }
}
