# TheisSolutionHours.py

# This code similates pumping induced drawdown for designing a pump test

# Scripted by Casey Gierke of Lee Wilson & Associates on 7/2/2013.
# Updated 10/9/2013

# With Notepad++, use F5 then copy this into box
# C:\Python27\python.exe -i "$(FULL_CURRENT_PATH)"

import math
import datetime as dt
import matplotlib.pyplot as plt
import numpy as np
import pylab as p
from matplotlib.ticker import MultipleLocator, FormatStrFormatter

plt.close("all")

## Theis Solution analysis of pumping

# INPUTS

# Parameters to adjust
Ss = 0.0001      # Specific Storage          [/ft]
K = 10              # Hydraulic conductivity    [ft/day]
So = 0             # Observed drawdown         [ft]
e = 1.00            # Well efficiency           [%]

# Parameters that should be constant
b = 45         # Screened interval         [ft]

T = 10000# 160             # Transmissivity            [ft^2/day]
S = .1 #Ss*b            # Storage coefficient       [-]
Q = 580              # Pumping rate              [gpm]
Q = Q*192.5        # Pumping rate, = 20 gpm    [ft^3/day]

rin = 400       # Radius                    [ft]
r = int(math.ceil(10*math.log(rin,10)))
r = range(r)        # All of this takes the input and
r = np.array(r)     # makes a log scale array up to the domain value
r = r/10.0
r = 10**r

# Defining time steps automatically
# This is all good but more than needed for this code

#r = range(1,5)
#t = range(24)       # Time                      [days]
#t = np.array(t)
#t = t/10.0
#t = (pow(10, t))

# Define output times

#t = [28, 90, 180, 365] #  Days

#ttime = [5, 10, 15, 72, 96, 120]
ttime = [2,3,4,5,6,7]
ttime = np.array(ttime)
t = ttime/float(24) # hours

NTime = len(t)-1

## COMPUTATIONS

# Build and populate u matrix with zeros
u = [[0 for _ in range(len(r))] for _ in range(len(t))]
Wu = [[0 for _ in range(len(r))] for _ in range(len(t))]
s = [[0 for _ in range(len(r))] for _ in range(len(t))]

# Calculate u

for i in range(0, len(t)):      # for time steps
    #t[i] = math.floor(t[i])     # Make sure that we calculate for whole # times
            # this would not be necessary if we specified times to calculate
    for j in range(0, len(r)):  # for length of domain
                   u[i][j] = pow(r[j],2)*Ss*b/(4*T*t[i])
                   
                   # Start loop to iterate W(u) series expansion
                   for n in range(2,11,2):
                       # Initialize series
                       seq_plus = 0
                       seq_minus = 0
                       # Build series up to 11th power
                       seq_plus = seq_plus + u[i][j]**(n+1)/((n+1)*math.factorial(n+1))
                       seq_minus = seq_minus -u[i][j]**n/(n*math.factorial(n))

                       n = n + 1

                   # Build well function    
                   Wu[i][j] = -0.577216-np.log(u[i][j])+u[i][j] +seq_plus+seq_minus

                   # Calculate drawdowns
                   s[i][j] = Q*Wu[i][j]/(4*math.pi*T) + So
                   j = j + 1                      
    i = i + 1

# Remove errors due to model limitations (ie, drawdowns recurring at large
# distances and (-) drawdowns
for i in range(0, len(t)):      # for time steps
    for j in range(1, len(r)):  # for length of domain
        if s[i][j] > s[i][j-1]:
            s[i][j] = None
        elif s[i][j] < 0:
            print('s[i][j]= ',i,j,s[i][j])
            print('s[i][j-1]= ',i,j-1,s[i][j-1])
            s[i][j] = 0
           
## OUTPUTS

# Axis labels
majorLocator   = MultipleLocator(r[len(r)-1]/4)
majorFormatter = FormatStrFormatter('%d')
minorLocator   = MultipleLocator(r[len(r)-1]/40)

# Create an array for labeling output
'''
For time in days
times = [str(int(t[0]))+' days', str(int(t[1]))+' days',
         str(int(t[2]))+' days', str(int(t[3]))+' days']
'''

# For time in hours
times = [str(int(ttime[0]))+' hours', str(int(ttime[1]))+' hours',
         str(int(ttime[2]))+' hours', str(int(ttime[3]))+' hours',
         str(int(ttime[4]))+' hours', str(int(ttime[5]))+' hours']


'''
# If using generated time outputs
times = [str(int(t[int(math.floor(NTime*.25))]))+' days', 
         str(int(t[int(math.floor(0.5*NTime))]))+' days',
         str(int(t[int(math.floor(NTime*.75))]))+' days',
         str(int(t[NTime]))+' days']

# Print only some of the heads calculated
heads = [s[int(math.floor(NTime*.25))], s[int(math.floor(0.5*NTime))], 
          s[int(math.floor(NTime*.75))], s[NTime]]
heads = np.array(heads)     # This is necessary in order to plot (?)
'''

# Plot output
fig = plt.figure()

# ax = fig.add_subplot(311)
ax = fig.add_subplot(111)
ax.plot(r,s[0],'o-')
ax.plot(r,s[1],'o-')
ax.plot(r,s[2],'o-')
ax.plot(r,s[3],'o-')
ax.plot(r,s[4],'o-')
ax.plot(r,s[5],'o-')

'''
# If using generated time outputs
ax.plot(r,heads[0],'o-')
ax.plot(r,heads[1], 'o-')
ax.plot(r,heads[2], 'o-')
ax.plot(r,heads[3], 'o-')
'''

# Now lets do stuff to the plot

plt.gca().invert_yaxis()    # Invert the y axis
title = str('Distance vs. Drawdown: S = ')+str(S)+str(', K = ')+str(K)
fig.suptitle(title, fontsize=14) 
plt.xlabel('Distance from pumping well [ft]', fontsize=12)
plt.ylabel('Drawdown [ft]', fontsize=12)
plt.legend(times, loc=0) # 4 is LR, 0 is best

# Axis labels
majorLocator   = plt.MultipleLocator(rin/4)
majorFormatter = FormatStrFormatter('%d')
#minorLocator   = MultipleLocator(rin/40)

ax.xaxis.set_major_locator(majorLocator)
ax.xaxis.set_major_formatter(majorFormatter)

#for the minor ticks, use no labels; default NullFormatter
#ax.xaxis.set_minor_locator(minorLocator)

'''
For analyzing effects on nearby wells

# Well screen info
top1 = 43
top2 = 58
top3 = 78

# Fill area to represent well screens
p.fill([0,r[len(r)-1],r[len(r)-1],0], [top1+10,top1+10,top1,top1],
       'b', alpha = 0.2, edgecolor='k')
p.fill([0,r[len(r)-1],r[len(r)-1],0], [top2+10,top2+10,top2,top2],
       'b', alpha = 0.2, edgecolor='k')
p.fill([0,r[len(r)-1],r[len(r)-1],0], [top3+10,top3+10,top3,top3],
       'b', alpha = 0.2, edgecolor='k')
# Project non interference drawdown
p.fill([0,r[len(r)-1],r[len(r)-1],0], [52,52,51.75,51.75],
       'k', alpha = 1)
'''
'''
# A second plot to debug

ax = fig.add_subplot(312)
ax.plot(r,u[0],'o-')
ax.plot(r,u[1], 'o-')
ax.plot(r,u[2], 'o-')
ax.plot(r,u[3], 'o-')
plt.legend(t, fontsize=12, loc=0)

ax = fig.add_subplot(313)
ax.plot(r,Wu[0],'o-')
ax.plot(r,Wu[1], 'o-')
ax.plot(r,Wu[2], 'o-')
ax.plot(r,Wu[3], 'o-')
plt.legend(t, fontsize=12, loc=0)
'''

plt.show()




