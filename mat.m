clc
clear all
% Define the dimensions of the space to plot
xmin = -1; xmax = 1;
ymin = -1; ymax = 1;
zmin = -1; zmax = 1;

% Define the number of points to plot in each direction
nx = 20; ny = 20; nz = 20;

% Create a grid of points in 3D space
X=linspace(xmin, xmax, nx);
Y=linspace(ymin, ymax, ny);
Z=linspace(zmin, zmax, nz);
[x, y, z] = meshgrid(X,Y,Z);

Bx = zeros(size(X));
By = zeros(size(Y));
Bz = zeros(size(Z));

% Define the current distribution function (replace with your own function)
I = @(x, y, z) [sin(x) + cos(y) + z 0 0];

fun=@(x,y,z,xr,yr,zr) cross(I(x,y,z),[xr-x yr-y zr-z])/norm([xr-x yr-y zr-z])^3;
mu0 = 4*pi*1e-7;  % vacuum permeability
for xr=X
    for yr=Y
        for zr=Z
            [xx yy zz] = mu0/(4*pi) * integral3(@(x,y,z) fun(x,y,z,xr,yr,zr), xmin,xmax,ymin,ymax,zmin,zmax);
            bx(xr) = xx;
            by(yr) = yy;
            bz(zr) = zz;
        end
    end
end

% Plot the magnetic field vectors using quiver3
figure;
quiver3(x, y, z, B);
xlabel('x'); ylabel('y'); zlabel('z');
title('3D Magnetic Field Plot');